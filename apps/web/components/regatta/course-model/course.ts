export type CourseId = "650m" | "350m";

export type Sample = { e: number; s: number; heading: number; at: number };

export const RIVER_FROM = -150;
export const RIVER_TO = 800;
export const BEND_FROM = 360;
export const BEND_TO = 470;
export const STEP = 2;

const RADIANS = Math.PI / 180;
const smoothstep = (t: number) => {
  const u = Math.min(1, Math.max(0, t));

  return u * u * (3 - 2 * u);
};

// Degrees clockwise from east, measured going downstream from the finish.
const headingAt = (at: number) => {
  if (at < -40) return 4 - 13 * smoothstep((at + 150) / 110);
  if (at < BEND_FROM)
    return -9 - 6 * Math.sin((Math.PI * Math.max(0, at)) / BEND_FROM);
  if (at < BEND_TO)
    return -9 + 54 * smoothstep((at - BEND_FROM) / (BEND_TO - BEND_FROM));
  if (at < 610) return 45;

  return 45 + 18 * smoothstep((at - 610) / 190);
};

export const widthAt = (at: number) => {
  if (at < -60) return 18;
  if (at < 20) return 18 + 6 * smoothstep((at + 60) / 60);
  if (at < 600) return 24;

  return 24 - 5 * smoothstep((at - 600) / 120);
};

const integrate = () => {
  const out: Sample[] = [];
  let e = 0;
  let s = 0;
  for (let at = 0; at >= RIVER_FROM; at -= STEP) {
    out.unshift({ at, e, heading: headingAt(at), s });
    const h = headingAt(at - STEP / 2) * RADIANS;
    e -= Math.cos(h) * STEP;
    s -= Math.sin(h) * STEP;
  }
  e = 0;
  s = 0;
  for (let at = 0; at < RIVER_TO; at += STEP) {
    const h = headingAt(at + STEP / 2) * RADIANS;
    e += Math.cos(h) * STEP;
    s += Math.sin(h) * STEP;
    out.push({ at: at + STEP, e, heading: headingAt(at + STEP), s });
  }

  return out;
};

export const RIVER: Sample[] = integrate();

export const pointAt = (at: number): Sample => {
  const index = Math.min(
    RIVER.length - 2,
    Math.max(0, Math.floor((at - RIVER_FROM) / STEP)),
  );
  const a = RIVER[index];
  const b = RIVER[index + 1];
  const t = (at - a.at) / STEP;

  return {
    at,
    e: a.e + (b.e - a.e) * t,
    heading: a.heading + (b.heading - a.heading) * t,
    s: a.s + (b.s - a.s) * t,
  };
};

// Unit vector to the left of travel downstream, which is the Suffolk bank on every reach.
export const leftOf = (heading: number): [number, number] => [
  Math.sin(heading * RADIANS),
  -Math.cos(heading * RADIANS),
];

export const offsetAt = (at: number, by: number): [number, number] => {
  const p = pointAt(at);
  const [le, ls] = leftOf(p.heading);

  return [p.e + le * by, p.s + ls * by];
};

export type Crew = { bank: "Suffolk" | "Essex"; lane: number; speed: number };

export type Course = {
  id: CourseId;
  length: number;
  boat: {
    name: string;
    length: number;
    seats: number;
    sculls: boolean;
    cox: boolean;
    beam: number;
    span: number;
  };
  start: "stake" | "free";
  rate: number;
  crews: [Crew, Crew];
};

// Race speeds near 1:23/500m for a sprint eight and 1:33/500m for a coxless quad.
export const COURSES: Record<CourseId, Course> = {
  "350m": {
    boat: {
      beam: 0.6,
      cox: true,
      length: 17.2,
      name: "8+",
      sculls: false,
      seats: 8,
      span: 5.6,
    },
    crews: [
      { bank: "Suffolk", lane: 5.5, speed: 6.05 },
      { bank: "Essex", lane: -5.5, speed: 6.0 },
    ],
    id: "350m",
    length: 350,
    rate: 40,
    start: "free",
  },
  "650m": {
    boat: {
      beam: 0.55,
      cox: false,
      length: 13.4,
      name: "4×−",
      sculls: true,
      seats: 4,
      span: 3.2,
    },
    crews: [
      { bank: "Suffolk", lane: 5.5, speed: 5.35 },
      { bank: "Essex", lane: -5.5, speed: 5.4 },
    ],
    id: "650m",
    length: 650,
    rate: 36,
    start: "stake",
  },
};

export const clock = (seconds: number) => {
  const whole = Math.max(0, seconds);
  const minutes = Math.floor(whole / 60);

  return `${minutes}:${(whole - minutes * 60).toFixed(1).padStart(4, "0")}`;
};

export const finishTimes = (course: Course, speeds: number[]) =>
  speeds.map((speed) => course.length / speed);

export const readoutOf = (
  course: Course,
  speeds: number[],
  elapsed: number,
) => {
  const times = finishTimes(course, speeds);
  const first = Math.min(...times);
  if (elapsed >= first) {
    const winner = times[0] < times[1] ? course.crews[0] : course.crews[1];
    const margin = Math.abs(times[0] - times[1]);

    return `${winner.bank} bank by ${margin < 0.05 ? "a canvas" : `${margin.toFixed(1)} s`} · ${clock(first)}`;
  }
  const lead = Math.min(
    ...speeds.map((speed) => course.length - speed * elapsed),
  );

  return `${Math.ceil(lead)} m to go · ${clock(elapsed)}`;
};
