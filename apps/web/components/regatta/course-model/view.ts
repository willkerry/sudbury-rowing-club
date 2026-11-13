import * as k from "@/components/iso/iso-kit";
import type { Plan, Plane, Point3, Projection } from "@/components/iso/iso-kit";
import { offsetAt, pointAt } from "./course";

export const M = 3;
// River widths, lanes and boats are drawn at this multiple of true size so a crew still reads as a crew.
export const EX = 1.5;
export const Z_LAND = 3;
export const Z_WATER = 1.7;
export const WIDTH = 640;
export const HEIGHT = 290;
const AZIMUTH = 77;
const ELEVATION = 42;

const PLATE_M = { e0: -112, e1: 684, s0: -150, s1: 172 };
export const MODEL: Plan = {
  d: (PLATE_M.s1 - PLATE_M.s0) / M,
  r: 0,
  w: (PLATE_M.e1 - PLATE_M.e0) / M,
  x: PLATE_M.e0 / M,
  y: PLATE_M.s0 / M,
};
export const BOARD: Plan = {
  d: MODEL.d + 19,
  r: 3,
  w: MODEL.w + 10,
  x: MODEL.x - 5,
  y: MODEL.y - 5,
};

export const w = ([e, s]: [number, number]): Plane => [e / M, s / M];

const fitPoints: Point3[] = [
  ...k.boxCorners(BOARD, -8, Z_LAND),
  ...k.boxCorners(MODEL, 0, Z_LAND + 9),
];
export const P: Projection = k.fitProjection(fitPoints, WIDTH, HEIGHT, {
  azimuth: AZIMUTH,
  elevation: ELEVATION,
  pad: 14,
});

export const boatFrame = (at: number, lane: number) => {
  const p = pointAt(at);
  const [x, y] = w(offsetAt(at, lane * EX));

  return { heading: (p.heading * Math.PI) / 180, x, y };
};
