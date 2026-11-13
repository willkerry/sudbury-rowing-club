"use client";

import * as React from "react";
import type { Flat } from "@/components/iso/iso-kit";
import {
  asksForStillness,
  follow,
  useInView,
  useLoop,
  useReadout,
} from "@/components/iso/react/live";
import { boatPaths } from "./boats";
import { COURSES, type CourseId, finishTimes, readoutOf } from "./course";
import { EX, M, P, Z_WATER, boatFrame } from "./view";

const SPEEDUP = 3;
const SVG = "http://www.w3.org/2000/svg";
const NUDGE = 25;
const REACH = 26;
const HOLD = 7;
const EASY_RATE = 20;

type Crew = {
  group: SVGGElement;
  parts: Record<string, SVGElement>;
  crew: SVGCircleElement[];
  phase: number;
};

const lapSpeeds = (base: number[], lap: number) => {
  if (lap === 0) return base;
  let seed = lap * 9301 + 49297;
  const rand = () => {
    seed = (seed * 233280 + 1) % 2147483647;

    return seed / 2147483647;
  };

  return base.map((speed) => speed * (1 + (rand() - 0.5) * 0.014));
};

// Distance to the finish of a crew's bow at race time t.
const bowAt = (length: number, speed: number, t: number, free: boolean) => {
  if (t < 0) return free ? length - t * 3 : length;
  const finish = length / speed;
  if (t <= finish) return length - speed * t;

  return -speed * 3 * (1 - Math.exp(-(t - finish) / 3));
};

const make = (tag: string, className: string) => {
  const node = document.createElementNS(SVG, tag);
  node.setAttribute("class", className);

  return node;
};

export const CourseLive = ({
  id,
  points,
  children,
}: {
  id: CourseId;
  points: Flat[];
  children: React.ReactNode;
}) => {
  const course = COURSES[id];
  const base = React.useMemo(
    () => course.crews.map((crew) => crew.speed),
    [course],
  );
  const { anchor, say } = useReadout<HTMLDivElement>();
  const inView = useInView(anchor);
  const crews = React.useRef<Crew[]>([]);
  const state = React.useRef({
    fade: 1,
    lap: 0,
    scrub: null as number | null,
    shown: 0,
    speeds: base,
    t: 0,
    wait: 0,
  });

  const draw = React.useCallback(() => {
    const { shown, speeds, fade } = state.current;
    for (const [index, crew] of course.crews.entries()) {
      const node = crews.current[index];
      if (!node) continue;
      const at = bowAt(
        course.length,
        speeds[index],
        shown,
        course.start === "free",
      );
      const frame = boatFrame(at, crew.lane);
      const paths = boatPaths(
        course,
        frame.x,
        frame.y,
        frame.heading,
        node.phase,
        M / EX,
        Z_WATER,
        P,
      );
      node.parts.blades.setAttribute("d", paths.blades);
      node.parts.oars.setAttribute("d", paths.oars);
      node.parts.fill.setAttribute("d", paths.fill);
      node.parts.shade.setAttribute("d", paths.shade);
      node.parts.top.setAttribute("d", paths.top);
      node.parts.edge.setAttribute("d", paths.outline);
      for (const [seat, [x, y]] of paths.crew.entries()) {
        node.crew[seat]?.setAttribute("cx", x.toFixed(1));
        node.crew[seat]?.setAttribute("cy", y.toFixed(1));
      }
      node.group.style.opacity = fade.toFixed(3);
    }
    const text = readoutOf(course, speeds, Math.max(0, shown));
    const togo = Math.max(
      0,
      Math.round(
        Math.min(
          ...speeds.map((speed) => course.length - speed * Math.max(0, shown)),
        ),
      ),
    );
    say(text);
    anchor.current?.setAttribute("aria-valuenow", String(togo));
    anchor.current?.setAttribute("aria-valuetext", text);
  }, [anchor, course, say]);

  React.useEffect(() => {
    const root = anchor.current?.querySelector("[data-boats]");
    if (!root) return;
    const still = asksForStillness();
    crews.current = course.crews.map((_, index) => {
      const group = make("g", "cm-boat") as SVGGElement;
      const parts: Record<string, SVGElement> = {};
      for (const [name, className] of [
        ["blades", "cm-boat-blade"],
        ["oars", "cm-boat-oar"],
        ["fill", "cm-boat-fill"],
        ["shade", "cm-boat-shade"],
        ["top", "cm-boat-top"],
        ["edge", "cm-boat-edge"],
      ] as const) {
        parts[name] = make("path", className);
        group.append(parts[name]);
      }
      const seats = course.boat.seats + (course.boat.cox ? 1 : 0);
      const crew = Array.from({ length: seats }, () => {
        const dot = make("circle", "cm-boat-crew") as SVGCircleElement;
        dot.setAttribute("r", "0.42");
        group.append(dot);

        return dot;
      });
      root.append(group);

      return { crew, group, parts, phase: still ? 0.2 : index * 0.07 };
    });
    if (still) {
      state.current.shown = (course.length / Math.max(...base)) * 0.45;
      state.current.t = state.current.shown;
    }
    draw();

    return () => {
      for (const node of crews.current) node.group.remove();
      crews.current = [];
    };
  }, [anchor, base, course, draw]);

  const tick = React.useCallback(
    (dt: number, calm: boolean) => {
      if (calm) return false;
      const s = state.current;
      const race = dt * SPEEDUP;
      const finished = Math.max(...finishTimes(course, s.speeds));
      if (s.scrub === null) {
        if (s.wait > 0) {
          s.wait -= race;
          s.fade = follow(s.fade, 0, dt, 0.35);
          if (s.wait <= 0) {
            s.lap += 1;
            s.speeds = lapSpeeds(base, s.lap);
            s.t = course.start === "free" ? -6 : -3;
            s.shown = s.t;
          }
        } else {
          s.t += race;
          s.fade = follow(s.fade, 1, dt, 0.35);
          if (s.t > finished + HOLD) s.wait = 2.4;
        }
        s.shown = s.wait > 0 ? s.shown : s.t;
      } else {
        s.fade = follow(s.fade, 1, dt, 0.2);
        s.shown = follow(s.shown, s.scrub, dt, 0.25);
        s.t = s.shown;
      }
      const moving =
        s.scrub === null ? race : Math.abs(s.scrub - s.shown) > 0.05 ? race : 0;
      for (const [index, node] of crews.current.entries()) {
        const racing =
          s.shown >= 0 && s.shown <= course.length / s.speeds[index];
        const rate = racing
          ? course.rate
          : course.start === "stake" && s.shown < 0
            ? 0
            : EASY_RATE;
        node.phase = (node.phase + (moving * rate) / 60) % 1;
      }
      draw();

      return true;
    },
    [base, course, draw],
  );

  useLoop(tick, inView);

  const timeAt = (at: number) => {
    const mean = base.reduce((a, b) => a + b, 0) / base.length;

    return Math.max(0, (course.length - at) / mean);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const svg = anchor.current?.querySelector("svg");
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    let best = -1;
    let nearest = REACH;
    for (const [index, [x, y]] of points.entries()) {
      const d = Math.hypot(x - point.x, y - point.y);
      if (d < nearest) {
        nearest = d;
        best = index;
      }
    }
    if (best >= 0) {
      state.current.scrub = timeAt(best * 5);
      state.current.wait = 0;
    } else state.current.scrub = null;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const mean = base.reduce((a, b) => a + b, 0) / base.length;
    const s = state.current;
    const from = s.scrub ?? Math.max(0, s.shown);
    const step: Record<string, number> = {
      ArrowLeft: NUDGE / mean,
      ArrowRight: -NUDGE / mean,
      End: Infinity,
      Home: -Infinity,
    };
    if (event.key === "Escape") {
      s.scrub = null;

      return;
    }
    const by = step[event.key];
    if (by === undefined) return;
    event.preventDefault();
    s.wait = 0;
    s.scrub = Math.min(timeAt(0), Math.max(0, from + by));
  };

  return (
    <div
      aria-label={`${course.id} course model: metres the leading crew has to go. Arrow keys move the crews; Escape resumes the race.`}
      aria-valuemax={course.length}
      aria-valuemin={0}
      aria-valuenow={course.length}
      className="cm-stage"
      onKeyDown={onKeyDown}
      onPointerLeave={() => {
        state.current.scrub = null;
      }}
      onPointerMove={onPointerMove}
      ref={anchor}
      role="slider"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
