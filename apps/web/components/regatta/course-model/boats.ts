import {
  type Flat,
  type Plane,
  type Projection,
  extrude,
  iso,
  pathOf,
} from "@/components/iso/iso-kit";
import type { Course } from "./course";

// Beam drawn wider than true so a shell still reads as a hull at this scale.
const BEAM = 1.3;

const lens = (length: number, beam: number, steps = 10): Plane[] => {
  const out: Plane[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = -1 + (2 * i) / steps;
    out.push([
      u * (length / 2),
      Math.sqrt(Math.max(0, 1 - u ** 4)) * (beam / 2),
    ]);
  }
  for (let i = steps - 1; i > 0; i--) {
    const u = -1 + (2 * i) / steps;
    out.push([
      u * (length / 2),
      -Math.sqrt(Math.max(0, 1 - u ** 4)) * (beam / 2),
    ]);
  }

  return out;
};

// Oar angle from square, positive toward the bow, through one stroke cycle.
export const oarAngle = (phase: number) => {
  const drive = 0.38;
  if (phase < drive) {
    const t = phase / drive;

    return { angle: 0.95 - 1.55 * (t * t * (3 - 2 * t)), wet: true };
  }
  const t = (phase - drive) / (1 - drive);

  return { angle: -0.6 + 1.55 * (t * t * (3 - 2 * t)), wet: false };
};

export type BoatPaths = {
  fill: string;
  top: string;
  shade: string;
  outline: string;
  oars: string;
  blades: string;
  crew: Flat[];
};

export const boatPaths = (
  course: Course,
  x: number,
  y: number,
  heading: number,
  phase: number,
  scale: number,
  zWater: number,
  P: Projection,
): BoatPaths => {
  const { boat } = course;
  const length = boat.length / scale;
  const c = Math.cos(heading);
  const s = Math.sin(heading);
  // u runs downstream from the bow, v toward the Suffolk bank.
  const toWorld = ([u, v]: Plane): Plane => [
    x + u * c + v * s,
    y + u * s - v * c,
  ];
  const hull = extrude(
    lens(length, BEAM / scale + 0.18).map(([u, v]) =>
      toWorld([u + length / 2, v]),
    ),
    zWater - 0.05,
    0.32,
    P,
  );
  const { angle, wet } = oarAngle(phase);
  const oarLength = (boat.sculls ? 2.9 : 3.75) / scale;
  const pin = (boat.sculls ? 0.8 : 0.85) / scale + 0.25;
  const oars: string[] = [];
  const blades: string[] = [];
  const crew: Flat[] = [];
  const zOar = zWater + 0.3;
  const zBlade = wet ? zWater : zWater + 0.35;
  const spacing = (length * 0.62) / boat.seats;
  for (let seat = 0; seat < boat.seats; seat++) {
    const u = length * (boat.cox ? 0.2 : 0.22) + seat * spacing;
    const sides = boat.sculls ? [1, -1] : [seat % 2 === 0 ? 1 : -1];
    const [cx, cy] = toWorld([u, 0]);
    crew.push(iso([cx, cy, zWater + 0.45], P));
    for (const side of sides) {
      const [px, py] = toWorld([u, side * pin]);
      const du = -Math.sin(angle);
      const dv = side * Math.cos(angle);
      const [tx, ty] = toWorld([
        u + du * oarLength * 0.88,
        side * pin + dv * oarLength * 0.88,
      ]);
      const [bx, by] = toWorld([
        u + du * oarLength,
        side * pin + dv * oarLength,
      ]);
      oars.push(
        pathOf([iso([px, py, zOar], P), iso([tx, ty, (zOar + zBlade) / 2], P)]),
      );
      blades.push(
        pathOf([
          iso([tx, ty, (zOar + zBlade) / 2], P),
          iso([bx, by, zBlade], P),
        ]),
      );
    }
  }
  if (boat.cox) {
    const [cx, cy] = toWorld([length * 0.93, 0]);
    crew.push(iso([cx, cy, zWater + 0.4], P));
  }

  return {
    blades: blades.join(""),
    crew,
    fill: hull.fill,
    oars: oars.join(""),
    outline: hull.outline,
    shade: hull.shades.join(""),
    top: hull.top,
  };
};
