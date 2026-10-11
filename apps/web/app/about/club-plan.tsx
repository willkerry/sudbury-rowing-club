"use client";

import { cn } from "@/lib/utils";
import {
  ARROWHEAD,
  compactPath,
  Dimmed,
  type Feature,
  fillHit,
  HALO,
  isInside,
  type Line,
  lineAngle,
  Plan,
  type Point,
  pointAlong,
  polylinePath,
  readableAngle,
  roundedPath,
  smoothClosedPath,
  type Tree,
  thickHit,
  treeCrown,
  type Vertex,
} from "./plan-kit";

/** The club’s own corners of the bank stay sharp; everything else is softened. */
const WATER = roundedPath([
  [1790, 40, 0],
  [1480, 820, 80],
  [1480, 1100, 50],
  [1520, 1400, 60],
  [1545, 1460, 0],
  [1362, 1460, 0],
  [1355, 1400, 50],
  [1342, 1100, 20],
  [1345, 1078, 20],
  [1300, 1080, 20],
  [1000, 1145, 60],
  [700, 1215, 60],
  [462, 1270, 40],
  [380, 1290, 40],
  [40, 1352, 0],
  [40, 1292, 0],
  [380, 1228, 40],
  [460, 1200, 40],
  [640, 1145, 60],
  [840, 1095, 60],
  [1100, 1015, 60],
  [1290, 940, 0],
  [1215, 745, 0],
  [1205, 730, 0],
  [1020, 640, 60],
  [810, 540, 60],
  [570, 360, 0],
  [570, 125, 0],
  [665, 125, 0],
  [665, 185, 0],
  [715, 185, 0],
  [718, 270, 0],
  [742, 334, 40],
  [800, 365, 40],
  [1150, 548, 0],
  [1200, 560, 0],
  [1220, 532, 0],
  [1350, 585, 0],
  [1415, 465, 60],
  [1610, 40, 0],
]);

export const BOATHOUSE =
  "M845,905 L1111.7,822.9 L1156.4,968.2 L889.7,1050.3 L856.2,1060.6 L838,1001.3 L871.5,991 Z";

export const CLUBHOUSE = "M676,798 H800 V1000 H735 V1037 H683 V1000 H676 Z";

/** The boathouse’s axes: along its length, and across it from north to south. */
const BOATHOUSE_ALONG: Point = [0.956, -0.294];
const BOATHOUSE_ACROSS: Point = [0.294, 0.956];
const BOATHOUSE_NORTH_EAST: Point = [1111.7, 822.9];

/** A point on the boathouse’s eastern wall, `across` from its north-east corner and `out` beyond it. */
const eastWallPoint = (across: number, out = 0) =>
  [
    BOATHOUSE_NORTH_EAST[0] +
      BOATHOUSE_ACROSS[0] * across +
      BOATHOUSE_ALONG[0] * out,
    BOATHOUSE_NORTH_EAST[1] +
      BOATHOUSE_ACROSS[1] * across +
      BOATHOUSE_ALONG[1] * out,
  ]
    .map((n) => n.toFixed(1))
    .join(",");

const BOATHOUSE_DOORWAY = { from: 25, to: 127 };
const BOATHOUSE_DOORWAY_MIDDLE =
  (BOATHOUSE_DOORWAY.from + BOATHOUSE_DOORWAY.to) / 2;

/** The boathouse’s walls, open where the sliding doors are. */
const BOATHOUSE_WALLS = `M${eastWallPoint(BOATHOUSE_DOORWAY.to)} L1156.4,968.2 L889.7,1050.3 L856.2,1060.6 L838,1001.3 L871.5,991 L845,905 L${BOATHOUSE_NORTH_EAST.join(",")} L${eastWallPoint(BOATHOUSE_DOORWAY.from)}`;

/** Two sliding panels just outside the eastern wall, flush and meeting in the middle. */
const slidingPanel = (from: number, to: number, out: number) =>
  `M${eastWallPoint(from, out)} L${eastWallPoint(to, out)} L${eastWallPoint(to, out + 4)} L${eastWallPoint(from, out + 4)} Z`;

const BOATHOUSE_DOORS = [
  slidingPanel(BOATHOUSE_DOORWAY.from - 4, BOATHOUSE_DOORWAY_MIDDLE, 4),
  slidingPanel(BOATHOUSE_DOORWAY_MIDDLE, BOATHOUSE_DOORWAY.to + 4, 4),
].join(" ");

/**
 * The clubhouse’s glazed north wall is set back under the gable, leaving a
 * covered area beneath the roof.
 */
const CLUBHOUSE_ROOF_EDGE = 798;
const CLUBHOUSE_GLAZING_Y = CLUBHOUSE_ROOF_EDGE + 32;

const CLUBHOUSE_WALLS = `M676,${CLUBHOUSE_GLAZING_Y} V1000 H683 V1037 H735 V1000 H800 V${CLUBHOUSE_GLAZING_Y}`;

const CLUBHOUSE_GLAZING = [-3, 0, 3]
  .map((offset) => `M676,${CLUBHOUSE_GLAZING_Y + offset} H800`)
  .join(" ");

const CLUBHOUSE_MULLIONS = [707, 738, 769]
  .map((x) => `M${x},${CLUBHOUSE_GLAZING_Y - 4} V${CLUBHOUSE_GLAZING_Y + 4}`)
  .join(" ");

/** The roof over the covered area, drawn dashed as it’s overhead. */
const CLUBHOUSE_COVERED = `M676,${CLUBHOUSE_GLAZING_Y} V${CLUBHOUSE_ROOF_EDGE} H800 V${CLUBHOUSE_GLAZING_Y}`;

const QUAY_THEATRE =
  "M718,134 H893 L1278,353.7 L1186.2,514.5 L800,325 C760,305 735,285 718,270 Z";

/** Quay Lane, running south into the car park. */
const ROAD_EDGES = "M440,230 L441.3,336.9 M487.4,230 L488.8,348.3";
const ROAD = "M440,230 L441.3,336.9 L488.8,348.3 L487.4,230 Z";

/** Backed up against the fence on one side and the clubhouse on the other. */
const BOAT_RACKS = { height: 212, width: 138, x: 532, y: 818 };

/**
 * Two banks of single-sided racks in square-section tube, seen from above:
 * uprights joined by a tie bar along the back, with arms reaching out one side.
 */
const RACK_BANKS: { spine: number; side: -1 | 1 }[] = [
  { side: 1, spine: BOAT_RACKS.x + 4 },
  { side: -1, spine: BOAT_RACKS.x + BOAT_RACKS.width - 4 },
];
const RACK_ENDS = {
  from: BOAT_RACKS.y + 10,
  to: BOAT_RACKS.y + BOAT_RACKS.height - 10,
};
const RACK_ARM = 30;
const TUBE = 4;

const RACK_UPRIGHT_YS = Array.from(
  { length: 6 },
  (_, i) => RACK_ENDS.from + (i * (RACK_ENDS.to - RACK_ENDS.from)) / 5,
);

const tube = (x1: number, y1: number, x2: number, y2: number) =>
  `M${Math.min(x1, x2)},${Math.min(y1, y2)} H${Math.max(x1, x2)} V${Math.max(y1, y2)} H${Math.min(x1, x2)} Z`;

const RACK_TIES = RACK_BANKS.map(({ spine }) =>
  tube(spine - TUBE / 2, RACK_ENDS.from, spine + TUBE / 2, RACK_ENDS.to),
).join(" ");

const RACK_ARMS = RACK_BANKS.flatMap(({ spine, side }) =>
  RACK_UPRIGHT_YS.map((y) =>
    tube(spine, y - TUBE / 2, spine + side * RACK_ARM, y + TUBE / 2),
  ),
).join(" ");

/**
 * A bank of the same racking along the outside of the boathouse’s north wall,
 * measured along the wall from its north-west corner and out from it.
 */
const BOATHOUSE_NORTH_WEST: Point = [845, 905];
const BOATHOUSE_NORTH_WALL_RACK = { combs: 9, from: 14, offset: 4, to: 265 };

const alongNorthWall = (along: number, out: number) =>
  [
    BOATHOUSE_NORTH_WEST[0] + 0.956 * along - 0.294 * out,
    BOATHOUSE_NORTH_WEST[1] - 0.294 * along - 0.956 * out,
  ]
    .map((n) => n.toFixed(1))
    .join(",");

const northWallTube = (
  from: number,
  to: number,
  outFrom: number,
  outTo: number,
) =>
  `M${alongNorthWall(from, outFrom)} L${alongNorthWall(to, outFrom)} L${alongNorthWall(to, outTo)} L${alongNorthWall(from, outTo)} Z`;

const { combs, from, offset, to } = BOATHOUSE_NORTH_WALL_RACK;

const NORTH_WALL_RACK = [
  northWallTube(from, to, offset, offset + TUBE),
  ...Array.from({ length: combs }, (_, i) => {
    const along = from + TUBE / 2 + (i * (to - from - TUBE)) / (combs - 1);

    return northWallTube(
      along - TUBE / 2,
      along + TUBE / 2,
      offset,
      offset + RACK_ARM,
    );
  }),
].join(" ");

const NORTH_WALL_RACK_AREA = northWallTube(from, to, 0, offset + RACK_ARM + 4);

/**
 * An eight’s hull seen from above: a long taper at each end and full beam for
 * most of its length. Each step is how far along the hull, and how much of the
 * full beam it is there.
 */
const HULL_PROFILE: [along: number, beam: number][] = [
  [0, 0],
  [0.04, 0.3],
  [0.09, 0.65],
  [0.15, 0.93],
  [0.21, 1],
  [0.8, 1],
  [0.86, 0.92],
  [0.92, 0.62],
  [0.97, 0.28],
  [1, 0],
];

/** A little shorter than the boathouse’s north wall, and about a 27th as wide as it is long. */
const EIGHT = { beam: 10, length: 255 };

const hull = ([cx, cy]: Point, [dx, dy]: Point) => {
  const side = (along: number, beam: number, sign: 1 | -1): Point => {
    const t = (along - 0.5) * EIGHT.length;
    const w = (beam * EIGHT.beam * sign) / 2;

    return [cx + dx * t - dy * w, cy + dy * t + dx * w];
  };

  return smoothClosedPath([
    ...HULL_PROFILE.map(([along, beam]) => side(along, beam, 1)),
    ...HULL_PROFILE.slice(1, -1)
      .reverse()
      .map(([along, beam]) => side(along, beam, -1)),
  ]);
};

const RACK_MIDDLE = BOAT_RACKS.y + BOAT_RACKS.height / 2;
const BOAT_ON_ARMS = RACK_ARM / 2 + 2;

const NORTH_WALL_RACK_MIDDLE = alongNorthWall(
  (BOATHOUSE_NORTH_WALL_RACK.from + BOATHOUSE_NORTH_WALL_RACK.to) / 2,
  BOATHOUSE_NORTH_WALL_RACK.offset + BOAT_ON_ARMS,
)
  .split(",")
  .map(Number) as Point;

const RACKED_BOATS = [
  ...RACK_BANKS.map(({ spine, side }) =>
    hull([spine + side * BOAT_ON_ARMS, RACK_MIDDLE], [0, 1]),
  ),
  hull(NORTH_WALL_RACK_MIDDLE, [0.956, -0.294]),
].join(" ");

export const LANDING_STAGE =
  "M1030,645 L1210,735 L1280,920 L1296.8,913.6 L1224.3,722 L1038,628.9 Z";

/** The fence runs parallel to the car park’s eastern edge. */
const fenceX = (y: number) => 520 + (10 * (y - 385)) / 780;

const GATE = { from: 510, to: 630 };

/** A single gate from the car park into the canoe club’s plot. */
const CANOE_CLUB_GATE = { from: 1064, to: 1098 };

/**
 * South of the yard racks, between the fence and the line of the clubhouse’s
 * west wall: fenced off and rented to the canoe club. The fence runs just clear
 * of the racked boats’ overhang.
 */
const CANOE_CLUB_FENCE_Y = RACK_MIDDLE + EIGHT.length / 2 + 6;
const CANOE_CLUB_EAST_X = 676;

const CANOE_CLUB_FENCE = `M${fenceX(CANOE_CLUB_FENCE_Y).toFixed(1)},${CANOE_CLUB_FENCE_Y} H${CANOE_CLUB_EAST_X} V1136`;

/** Posts across the canoe club’s fence, matching the main fence. */
const CANOE_CLUB_FENCE_POSTS = [
  ...Array.from(
    {
      length: Math.floor(
        (CANOE_CLUB_EAST_X - fenceX(CANOE_CLUB_FENCE_Y) - 14) / 28,
      ),
    },
    (_, i) =>
      `M${(fenceX(CANOE_CLUB_FENCE_Y) + 28 + i * 28).toFixed(1)},${CANOE_CLUB_FENCE_Y - 7} v14`,
  ),
  ...Array.from(
    { length: Math.floor((1136 - CANOE_CLUB_FENCE_Y - 14) / 28) + 1 },
    (_, i) =>
      `M${CANOE_CLUB_EAST_X - 7},${(CANOE_CLUB_FENCE_Y + 14 + i * 28).toFixed(1)} h14`,
  ),
].join(" ");

/** The car park’s eastern edge, which leans slightly like the fence. */
const carParkEdgeX = (y: number) => 495 + (10 * (1130 - y)) / 780;

export const CAR_PARK_OUTLINE: Vertex[] = [
  [441.3, 336.9, 0],
  [285, 300, 30],
  [285, 445, 40],
  [110, 1190, 30],
  [505, 1130, 30],
  [carParkEdgeX(CANOE_CLUB_GATE.to), CANOE_CLUB_GATE.to, 12],
  [fenceX(CANOE_CLUB_GATE.to), CANOE_CLUB_GATE.to, 0],
  [fenceX(CANOE_CLUB_GATE.from), CANOE_CLUB_GATE.from, 0],
  [carParkEdgeX(CANOE_CLUB_GATE.from), CANOE_CLUB_GATE.from, 12],
  [carParkEdgeX(GATE.to), GATE.to, 12],
  [fenceX(GATE.to), GATE.to, 0],
  [fenceX(GATE.from), GATE.from, 0],
  [carParkEdgeX(GATE.from), GATE.from, 12],
  [495, 350, 20],
  [488.8, 348.3, 0],
];

/**
 * Open where Quay Lane enters it from the north, and at each of the gates,
 * where the edge curves round to meet the fence either side of the opening.
 */
const CAR_PARK = [
  roundedPath(CAR_PARK_OUTLINE.slice(0, 7), false),
  roundedPath(CAR_PARK_OUTLINE.slice(7, 11), false),
  roundedPath(CAR_PARK_OUTLINE.slice(11), false),
].join(" ");

const CAR_PARK_AREA = roundedPath(CAR_PARK_OUTLINE);

/** A car seen from above, nose pointing along +x, at the same scale as the eights. */
const CAR = { length: 66, width: 26 };

const CAR_BODY = `M${-CAR.length / 2 + 7},${-CAR.width / 2} H${CAR.length / 2 - 9} Q${CAR.length / 2},${-CAR.width / 2} ${CAR.length / 2},${-CAR.width / 2 + 8} V${CAR.width / 2 - 8} Q${CAR.length / 2},${CAR.width / 2} ${CAR.length / 2 - 9},${CAR.width / 2} H${-CAR.length / 2 + 7} Q${-CAR.length / 2},${CAR.width / 2} ${-CAR.length / 2},${CAR.width / 2 - 7} V${-CAR.width / 2 + 7} Q${-CAR.length / 2},${-CAR.width / 2} ${-CAR.length / 2 + 7},${-CAR.width / 2} Z`;

const CAR_WINDOWS =
  "M6,-9.5 L15,-10.5 Q17,0 15,10.5 L6,9.5 Q5,0 6,-9.5 Z M-23,-9.5 L-17,-9 Q-16,0 -17,9 L-23,9.5 Q-24,0 -23,-9.5 Z";

const CAR_MIRRORS = "M9,-13 l-2,-4 M9,13 l-2,4";

/** The car park’s slanted western edge. */
const carParkWestX = (y: number) => 285 - (175 * (y - 445)) / 745;

/** Bay width: wide enough that neighbouring wing mirrors clear each other. */
const CAR_SPACING = CAR.width + 14;

/** No parking along the east edge where Quay Lane opens into the car park. */
const LANE_MOUTH_CLEARANCE = 440;

/** Parked nose-in along both edges, clear of the lane entrance and the gates, with a few bays free. */
const PARKED_CARS: { x: number; y: number; facing: 1 | -1 }[] = [
  ...Array.from({ length: 19 }, (_, i) => 470 + i * CAR_SPACING)
    .filter((_, i) => ![3, 8, 9, 14].includes(i))
    .map((y) => ({
      facing: -1 as const,
      x: carParkWestX(y) + CAR.length / 2 + 8,
      y,
    })),
  ...Array.from({ length: 19 }, (_, i) => 400 + i * CAR_SPACING)
    .filter((y) => y < GATE.from - 30 || y > GATE.to + 30)
    .filter((_, i) => ![2, 7].includes(i))
    .filter((y) => y > LANE_MOUTH_CLEARANCE)
    .map((y) => ({
      facing: 1 as const,
      x: carParkEdgeX(y) - CAR.length / 2 - 8,
      y,
    })),
].filter(({ y }) => y < 1110);

const FENCE = `M570,362 L520,385 L${fenceX(GATE.from).toFixed(1)},${GATE.from} M${fenceX(GATE.to).toFixed(1)},${GATE.to} L${fenceX(CANOE_CLUB_GATE.from).toFixed(1)},${CANOE_CLUB_GATE.from} M${fenceX(CANOE_CLUB_GATE.to).toFixed(1)},${CANOE_CLUB_GATE.to} L530,1178`;

const FENCE_POSTS = Array.from({ length: 28 }, (_, i) => 400 + i * 28)
  .filter(
    (y) =>
      (y < GATE.from - 8 || y > GATE.to + 8) &&
      (y < CANOE_CLUB_GATE.from - 8 || y > CANOE_CLUB_GATE.to + 8),
  )
  .map((y) => `M${(fenceX(y) - 7).toFixed(1)},${y} h14`)
  .join(" ");

/** Double gates, each leaf hinged at one end of the opening and shown open into the club. */
const GATE_LEAF_LENGTH = (GATE.to - GATE.from) / 2;
const GATE_MIDDLE = (GATE.from + GATE.to) / 2;

const point = (y: number) => `${fenceX(y).toFixed(1)},${y}`;

const gateLeafEnd = (hingeY: number, direction: 1 | -1) =>
  `${(fenceX(hingeY) + GATE_LEAF_LENGTH * 0.5).toFixed(1)},${(hingeY + direction * GATE_LEAF_LENGTH * 0.866).toFixed(1)}`;

const GATE_LEAVES = [
  `M${point(GATE.from)} L${gateLeafEnd(GATE.from, 1)}`,
  `M${point(GATE.to)} L${gateLeafEnd(GATE.to, -1)}`,
].join(" ");

const GATE_SWING = [
  `M${gateLeafEnd(GATE.from, 1)} A${GATE_LEAF_LENGTH},${GATE_LEAF_LENGTH} 0 0 1 ${point(GATE_MIDDLE)}`,
  `M${gateLeafEnd(GATE.to, -1)} A${GATE_LEAF_LENGTH},${GATE_LEAF_LENGTH} 0 0 0 ${point(GATE_MIDDLE)}`,
].join(" ");

/** The canoe club’s single gate, hinged at its northern post and shown open inwards. */
const CANOE_CLUB_GATE_WIDTH = CANOE_CLUB_GATE.to - CANOE_CLUB_GATE.from;

const CANOE_CLUB_GATE_OPEN = `${(fenceX(CANOE_CLUB_GATE.from) + CANOE_CLUB_GATE_WIDTH * 0.5).toFixed(1)},${(CANOE_CLUB_GATE.from + CANOE_CLUB_GATE_WIDTH * 0.866).toFixed(1)}`;

const CANOE_CLUB_GATE_LEAF = `M${point(CANOE_CLUB_GATE.from)} L${CANOE_CLUB_GATE_OPEN}`;

const CANOE_CLUB_GATE_SWING = `M${CANOE_CLUB_GATE_OPEN} A${CANOE_CLUB_GATE_WIDTH},${CANOE_CLUB_GATE_WIDTH} 0 0 1 ${point(CANOE_CLUB_GATE.to)}`;

const RAILWAY_LAST: Point = [1804, 1040];

const RAILWAY: Point[] = [[110, 1440], [860, 1290], [1500, 1125], RAILWAY_LAST];

/**
 * The bridge carrying the old railway line, now a track, over the water. It
 * starts level with the west end of the boathouse and runs out of frame.
 */
const BRIDGE = { from: 840, to: 1804 };

const TRACK_HALF_WIDTH = 16;

const railwayPoint = (x: number): Point => {
  for (let i = 0; i < RAILWAY.length - 1; i++) {
    const [x1, y1] = RAILWAY[i];
    const [x2, y2] = RAILWAY[i + 1];

    if (x >= x1 && x <= x2) {
      return [x, y1 + ((x - x1) / (x2 - x1)) * (y2 - y1)];
    }
  }

  return RAILWAY_LAST;
};

const railwayNormal = (x: number): Point => {
  const [, y1] = railwayPoint(x - 1);
  const [, y2] = railwayPoint(x + 1);
  const length = Math.hypot(2, y2 - y1);

  return [-(y2 - y1) / length, 2 / length];
};

const offsetPoint = (x: number, offset: number) => {
  const [px, py] = railwayPoint(x);
  const [nx, ny] = railwayNormal(x);

  return `${(px + nx * offset).toFixed(1)},${(py + ny * offset).toFixed(1)}`;
};

const offsetLine = (offset: number, from: number, to: number) => {
  const points: string[] = [];

  for (let x = from; x < to; x += 8) {
    points.push(offsetPoint(x, offset));
  }
  points.push(offsetPoint(to, offset));

  return `M${points.join(" L")}`;
};

const RAILWAY_START = RAILWAY[0][0];

const TRACK_EDGES = compactPath(
  [-1, 1]
    .map((side) =>
      offsetLine(TRACK_HALF_WIDTH * side, RAILWAY_START, BRIDGE.from),
    )
    .join(" "),
);

const BRIDGE_PARAPET = TRACK_HALF_WIDTH + 4;

const BRIDGE_SIDES = compactPath(
  [-1, 1]
    .map((side) => offsetLine(BRIDGE_PARAPET * side, BRIDGE.from, BRIDGE.to))
    .join(" "),
);

/** The bridge’s deck, filled so it hides the water beneath it. */
const BRIDGE_DECK = compactPath(
  `${offsetLine(-BRIDGE_PARAPET, BRIDGE.from, BRIDGE.to)} L${offsetLine(
    BRIDGE_PARAPET,
    BRIDGE.from,
    BRIDGE.to,
  )
    .slice(1)
    .split(" L")
    .reverse()
    .join(" L")} Z`,
);

const BRIDGE_WINGS = [BRIDGE.from]
  .flatMap((x) => {
    const [nx, ny] = railwayNormal(x);
    const [tx, ty] = [-ny, nx];

    return [-1, 1].map(
      (side) =>
        `M${offsetPoint(x, BRIDGE_PARAPET * side)} l${(tx * 16 + nx * 12 * side).toFixed(1)},${(ty * 16 + ny * 12 * side).toFixed(1)}`,
    );
  })
  .join(" ");

/** A footpath south from the bottom of the car park, over the channel to the track. */
const FOOTPATH = { from: 1148, halfWidth: 8, to: 1362 };
const FOOTBRIDGE = { from: 1208, to: 1298 };

const footpathX = (y: number) => 386 + (36 * (y - FOOTPATH.from)) / 214;

const footpathEdge = (
  side: -1 | 1,
  from: number,
  to: number,
  offset = FOOTPATH.halfWidth,
) =>
  `M${(footpathX(from) + offset * side).toFixed(1)},${from} L${(footpathX(to) + offset * side).toFixed(1)},${to}`;

const FOOTPATH_EDGES = ([-1, 1] as const)
  .flatMap((side) => [
    footpathEdge(side, FOOTPATH.from, FOOTBRIDGE.from),
    footpathEdge(side, FOOTBRIDGE.to, FOOTPATH.to),
  ])
  .join(" ");

const FOOTBRIDGE_PARAPET = FOOTPATH.halfWidth + 4;

const FOOTBRIDGE_SIDES = ([-1, 1] as const)
  .map((side) =>
    footpathEdge(side, FOOTBRIDGE.from, FOOTBRIDGE.to, FOOTBRIDGE_PARAPET),
  )
  .join(" ");

const FOOTBRIDGE_DECK = `M${(footpathX(FOOTBRIDGE.from) - FOOTBRIDGE_PARAPET).toFixed(1)},${FOOTBRIDGE.from} L${(footpathX(FOOTBRIDGE.to) - FOOTBRIDGE_PARAPET).toFixed(1)},${FOOTBRIDGE.to} L${(footpathX(FOOTBRIDGE.to) + FOOTBRIDGE_PARAPET).toFixed(1)},${FOOTBRIDGE.to} L${(footpathX(FOOTBRIDGE.from) + FOOTBRIDGE_PARAPET).toFixed(1)},${FOOTBRIDGE.from} Z`;

const FOOTBRIDGE_WINGS = ([-1, 1] as const)
  .flatMap((side) =>
    [
      [FOOTBRIDGE.from, -1],
      [FOOTBRIDGE.to, 1],
    ].map(
      ([y, direction]) =>
        `M${(footpathX(y) + FOOTBRIDGE_PARAPET * side).toFixed(1)},${y} l${8 * side},${10 * direction}`,
    ),
  )
  .join(" ");

/** Grass along the bank, from the fence by the tree to the landing stage. */
const GRASS: Point[] = [
  [521, 386],
  [570, 362],
  [810, 540],
  [1030, 645],
  [940, 690],
  [521, 445],
];

/** The grass carries on north beyond the fence, between Quay Lane and the water. */
const GRASS_NORTH: Point[] = [
  [521, 230],
  [568, 230],
  [570, 358],
  [521, 381],
];

const GRASS_OUTLINE = [GRASS, GRASS_NORTH]
  .map((area) => roundedPath(area.map(([x, y]): Vertex => [x, y, 18])))
  .join(" ");

/** The large tree in the top corner of the club’s plot. */
const TREE: Tree = { r: 100, x: 625, y: 470 };

const TREE_CROWN = treeCrown(TREE);

const GRASS_TUFTS = Array.from({ length: 19 }, (_, row) =>
  Array.from(
    { length: 17 },
    (_, column): Point => [484 + column * 36 + (row % 2) * 18, 240 + row * 26],
  ),
)
  .flat()
  .filter(
    (point) =>
      [GRASS, GRASS_NORTH].some(
        (area) =>
          isInside(point, area) && isInside([point[0], point[1] - 10], area),
      ) && Math.hypot(point[0] - TREE.x, point[1] - TREE.y) > TREE.r + 10,
  )
  .map(([x, y]) => `M${x - 5},${y} l2,-7 M${x},${y} v-8 M${x + 5},${y} l-2,-7`)
  .join(" ");

/** The club’s plot, bounded by the fence and the water, matching the softened bank. */
export const CLUB_SITE_OUTLINE: Vertex[] = [
  [521, 386, 0],
  [570, 360, 0],
  [810, 540, 60],
  [1020, 640, 60],
  [1205, 730, 0],
  [1215, 745, 0],
  [1290, 940, 0],
  [1100, 1015, 60],
  [840, 1095, 60],
  [640, 1145, 60],
  [530, 1178, 0],
];

const CLUB_SITE = roundedPath(CLUB_SITE_OUTLINE);

const VIEW_BOX = { height: 1090, width: 1724, x: 80, y: 240 };

/**
 * The Cut’s banks, from the corners of the water’s outline. The west bank runs
 * straight past the mouth of the arm to the Quay, as if it weren’t there.
 */
const CUT_EAST_BANK: Point[] = [
  [1790, 40],
  [1480, 820],
  [1480, 1100],
  [1520, 1400],
  [1545, 1460],
];
const CUT_WEST_BANK: Point[] = [
  [1610, 40],
  [1415, 465],
  [1350, 585],
  [1215, 745],
  [1290, 940],
  [1345, 1078],
  [1342, 1100],
  [1355, 1400],
  [1362, 1460],
];

/** Where a bank crosses a given y, both banks running steadily south. */
const bankX = (bank: Point[], y: number) => {
  const i = Math.max(
    bank.findIndex(([, by]) => by >= y),
    1,
  );
  const [[x1, y1], [x2, y2]] = [bank[i - 1], bank[i]];

  return x1 + ((x2 - x1) * (y - y1)) / (y2 - y1);
};

/** The middle of the Cut’s channel, halfway between its banks. */
const midChannel = (y: number): Point => [
  (bankX(CUT_EAST_BANK, y) + bankX(CUT_WEST_BANK, y)) / 2,
  y,
];

/** The Cut’s upper reach, down the middle of its channel. */
const CUT_UPPER: Line = [midChannel(210), midChannel(600)];

/** The last straight of the Cut, down the middle of its channel. */
const CUT_LOWER: Line = [midChannel(1115), midChannel(1409)];

/**
 * A line down the middle of the Cut, heading south towards the Stour, eased
 * where the channel widens past the landing stage.
 */
const CUT_MIDDLE: Point[] = (() => {
  const points = Array.from({ length: 61 }, (_, i) => midChannel(210 + i * 15));

  return points.map((point, i): Point => {
    const around = points.slice(Math.max(i - 3, 0), i + 4);

    return i === 0 || i === points.length - 1
      ? point
      : [around.reduce((sum, [x]) => sum + x, 0) / around.length, point[1]];
  });
})();

const CUT_CENTRE_LINE = polylinePath([...CUT_MIDDLE, ...CUT_LOWER]);

const STOUR_ARROW_TAIL = pointAlong(CUT_LOWER, 0.38);
const STOUR_ARROW_TIP = pointAlong(CUT_LOWER, 0.64);
const STOUR_ARROW_ANGLE = lineAngle(CUT_LOWER);

const polylineLength = (points: Point[]) =>
  points
    .slice(1)
    .reduce(
      (length, [x, y], i) =>
        length + Math.hypot(x - points[i][0], y - points[i][1]),
      0,
    );

/** How far short of the arrow’s tail “To the Stour” ends. */
const STOUR_LABEL_GAP = 22;

/** Where “To the Stour” ends, measured along the centre line. */
const STOUR_LABEL_END =
  polylineLength([...CUT_MIDDLE, CUT_LOWER[0], STOUR_ARROW_TAIL]) -
  STOUR_LABEL_GAP;

/**
 * The landing stage’s inner edge, along the bank: its north-east run, then
 * its southern arm down to the boathouse.
 */
const LANDING_STAGE_EDGE: Point[] = [
  [1030, 645],
  [1210, 735],
  [1280, 920],
];

/** How far out over the water the label runs, as the stage is too thin to hold it. */
const LANDING_STAGE_LABEL_OUT = 32;

/** A line parallel to the stage and out over the water, rounded at the corner. */
const LANDING_STAGE_LABEL_PATH = (() => {
  const [a, corner, b] = LANDING_STAGE_EDGE;
  const outward = ([x1, y1]: Point, [x2, y2]: Point): Point => {
    const length = Math.hypot(x2 - x1, y2 - y1);

    return [
      ((y2 - y1) / length) * LANDING_STAGE_LABEL_OUT,
      (-(x2 - x1) / length) * LANDING_STAGE_LABEL_OUT,
    ];
  };
  const [ox1, oy1] = outward(a, corner);
  const [ox2, oy2] = outward(corner, b);

  // Where the two offset runs meet, beyond the corner.
  const [dx1, dy1] = [corner[0] - a[0], corner[1] - a[1]];
  const [dx2, dy2] = [b[0] - corner[0], b[1] - corner[1]];
  const t =
    ((corner[0] + ox2 - (a[0] + ox1)) * dy2 -
      (corner[1] + oy2 - (a[1] + oy1)) * dx2) /
    (dx1 * dy2 - dy1 * dx2);

  return roundedPath(
    [
      [a[0] + ox1, a[1] + oy1, 0],
      [a[0] + ox1 + dx1 * t, a[1] + oy1 + dy1 * t, 70],
      [b[0] + ox2, b[1] + oy2, 0],
    ],
    false,
  );
})();

/** The Quay Theatre’s southern wall, the one edge of it wholly in view. */
const QUAY_THEATRE_SOUTH_WALL: Line = [
  [800, 325],
  [1186.2, 514.5],
];

const UP_THE_PLAN: Line = [
  [0, 1],
  [0, 0],
];

/** The middle of the car park’s aisle, between the two rows of parked cars. */
const CAR_PARK_AISLE: Line = [
  [383, 470],
  [313, 1100],
];

const FEATURES: Feature[] = [
  {
    description: "A man-made channel off the River Stour.",
    drawing: (
      <path
        d={WATER}
        fill="currentColor"
        fillOpacity="0.07"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
    ),
    hit: fillHit(WATER),
    id: "cut",
    name: "The Cut",
    label: {
      angle: readableAngle(CUT_UPPER),
      at: midChannel(531),
      size: 30,
    },
  },
  {
    description: "The way in from the town centre.",
    drawing: (
      <>
        <path d={ROAD} fill="currentColor" fillOpacity="0.05" stroke="none" />
        <path d={ROAD_EDGES} strokeOpacity="0.55" strokeWidth="2" />
      </>
    ),
    hit: fillHit(ROAD),
    id: "lane",
    label: { angle: readableAngle(UP_THE_PLAN), at: [464.4, 330], size: 20 },
    name: "Quay Lane",
  },
  {
    description:
      "Run by Babergh District Council, just outside the club gates. 25 free spaces; stays up to 24 hours, no return within four hours.",
    drawing: (
      <>
        <path
          d={CAR_PARK}
          strokeDasharray="10 8"
          strokeOpacity="0.5"
          strokeWidth="2"
        />
        {PARKED_CARS.map(({ facing, x, y }) => (
          <g
            key={`${x},${y}`}
            transform={`translate(${x.toFixed(1)} ${y}) rotate(${facing === 1 ? 0 : 180})`}
          >
            <path
              d={CAR_BODY}
              fill="white"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
            <path
              d={CAR_WINDOWS}
              fill="currentColor"
              fillOpacity="0.25"
              stroke="none"
            />
            <path
              d={CAR_MIRRORS}
              strokeLinecap="round"
              strokeOpacity="0.6"
              strokeWidth="1.5"
            />
          </g>
        ))}
      </>
    ),
    hit: fillHit(CAR_PARK_AREA),
    id: "car-park",
    name: "Quay Lane Car Park",
    label: {
      angle: readableAngle(CAR_PARK_AISLE),
      at: pointAlong(CAR_PARK_AISLE, 0.5),
      size: 28,
    },
  },
  {
    description: "Outdoor storage for more of the fleet.",
    drawing: (
      <>
        <path
          d={RACK_TIES}
          fill="currentColor"
          fillOpacity="0.6"
          stroke="none"
        />
        <path
          d={RACK_ARMS}
          fill="currentColor"
          fillOpacity="0.6"
          stroke="none"
        />
        <path
          d={NORTH_WALL_RACK}
          fill="currentColor"
          fillOpacity="0.6"
          stroke="none"
        />
        <path d={RACKED_BOATS} fill="white" stroke="none" />
        <path
          d={RACKED_BOATS}
          fill="currentColor"
          fillOpacity="0.12"
          strokeOpacity="0.8"
          strokeWidth="1.5"
        />
      </>
    ),
    hit: (
      <>
        <rect {...BOAT_RACKS} fill="transparent" stroke="none" />
        {fillHit(NORTH_WALL_RACK_AREA)}
      </>
    ),
    id: "racks",
    name: "Boat racks",
    label: {
      angle: readableAngle(UP_THE_PLAN),
      at: [BOAT_RACKS.x + BOAT_RACKS.width / 2, RACK_MIDDLE],
      size: 20,
    },
  },
  {
    description: "Our next-door neighbour on Quay Lane.",
    drawing: (
      <path
        d={QUAY_THEATRE}
        fill="currentColor"
        fillOpacity="0.05"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
    ),
    hit: fillHit(QUAY_THEATRE),
    id: "theatre",
    name: "Quay Theatre",
    label: {
      angle: readableAngle(QUAY_THEATRE_SOUTH_WALL),
      at: [1028, 343],
      size: 30,
    },
  },
  {
    description: "Home to most of the fleet.",
    drawing: (
      <>
        <path
          d={BOATHOUSE}
          fill="currentColor"
          fillOpacity="0.12"
          stroke="none"
        />
        <path d={BOATHOUSE_WALLS} strokeWidth="3" />
        <path
          d={BOATHOUSE_DOORS}
          fill="currentColor"
          fillOpacity="0.3"
          strokeWidth="1.5"
        />
      </>
    ),
    hit: fillHit(BOATHOUSE),
    id: "boathouse",
    name: "Boathouse",
    label: {
      angle: readableAngle([BOATHOUSE_NORTH_WEST, BOATHOUSE_NORTH_EAST]),
      at: [1000.7, 936.6],
      size: 28,
    },
  },
  {
    description:
      "Changing rooms, a kitchen and a room used for committee meetings and refreshments between sessions.",
    drawing: (
      <>
        <path
          d={CLUBHOUSE_COVERED}
          strokeDasharray="8 6"
          strokeOpacity="0.7"
          strokeWidth="2"
        />
        <path
          d={CLUBHOUSE}
          fill="currentColor"
          fillOpacity="0.12"
          stroke="none"
        />
        <path d={CLUBHOUSE_WALLS} strokeWidth="3" />
        <path d={CLUBHOUSE_GLAZING} strokeWidth="1" />
        <path d={CLUBHOUSE_MULLIONS} strokeWidth="1" />
      </>
    ),
    hit: fillHit(CLUBHOUSE),
    id: "clubhouse",
    label: { angle: readableAngle(UP_THE_PLAN), at: [738, 910], size: 19 },
    name: "Clubhouse",
  },
  {
    description: "Where crews get on and off the water.",
    drawing: (
      <path
        d={LANDING_STAGE}
        fill="currentColor"
        fillOpacity="0.6"
        strokeLinejoin="miter"
        strokeWidth="1.5"
      />
    ),
    hit: thickHit("M1034,637 L1217,728 L1288,917"),
    id: "landing-stage",
    label: { path: LANDING_STAGE_LABEL_PATH, size: 19 },
    name: "Landing stage",
  },
];

/** Drawn for context, but not interactive. */
const SCENERY = (
  <>
    <path
      d={TRACK_EDGES}
      strokeDasharray="12 8"
      strokeOpacity="0.5"
      strokeWidth="2"
    />
    <path className="fill-blue-50" d={BRIDGE_DECK} stroke="none" />
    <path d={BRIDGE_SIDES} strokeOpacity="0.6" strokeWidth="2.5" />
    <path d={BRIDGE_WINGS} strokeOpacity="0.6" strokeWidth="2.5" />
    <path d={FOOTPATH_EDGES} strokeOpacity="0.5" strokeWidth="1.5" />
    <path className="fill-blue-50" d={FOOTBRIDGE_DECK} stroke="none" />
    <path d={FOOTBRIDGE_SIDES} strokeOpacity="0.6" strokeWidth="2" />
    <path d={FOOTBRIDGE_WINGS} strokeOpacity="0.6" strokeWidth="2" />
    <path
      d={GRASS_OUTLINE}
      strokeDasharray="3 6"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />
    <path
      d={GRASS_TUFTS}
      strokeLinecap="round"
      strokeOpacity="0.45"
      strokeWidth="1.5"
    />
    <path
      d={TREE_CROWN}
      fill="currentColor"
      fillOpacity="0.06"
      strokeOpacity="0.6"
      strokeWidth="2"
    />
    <circle
      cx={TREE.x}
      cy={TREE.y}
      fill="currentColor"
      fillOpacity="0.6"
      r="4"
      stroke="none"
    />
    <path d={FENCE} strokeOpacity="0.75" strokeWidth="2.5" />
    <path d={FENCE_POSTS} strokeOpacity="0.5" strokeWidth="2" />
    <path d={GATE_LEAVES} strokeOpacity="0.75" strokeWidth="2.5" />
    <path d={CANOE_CLUB_GATE_LEAF} strokeOpacity="0.75" strokeWidth="2.5" />
    <path
      d={CANOE_CLUB_GATE_SWING}
      strokeDasharray="4 5"
      strokeOpacity="0.5"
      strokeWidth="1.5"
    />
    <path
      d={GATE_SWING}
      strokeDasharray="4 5"
      strokeOpacity="0.5"
      strokeWidth="1.5"
    />
  </>
);

/** Lists the site’s features in the order a reader would look for them. */
const LEGEND = [
  "clubhouse",
  "boathouse",
  "landing-stage",
  "racks",
  "car-park",
  "lane",
  "cut",
  "theatre",
];

export const ClubPlan = ({ className }: { className?: string }) => (
  <Plan
    ariaLabel="Plan of the club’s site on Quay Lane"
    className={className}
    features={FEATURES}
    legend={LEGEND}
    overlay={(activeId) => (
      <>
        <Dimmed dim={!!activeId}>
          {SCENERY}
          <text
            className="font-archivo font-bold font-stretch-ultra-expanded text-[34px] uppercase tracking-[0.16em]"
            fill="currentColor"
            textAnchor="middle"
            x="860"
            y="745"
            {...HALO}
          >
            The club
          </text>
        </Dimmed>

        <g
          aria-hidden
          className={cn(
            "pointer-events-none transition-opacity duration-200 ease-out-strong",
            activeId === "cut" ? "opacity-100" : "opacity-0",
          )}
        >
          <path d={CUT_CENTRE_LINE} id="club-plan-cut-centre" stroke="none" />
          <text
            className="font-archivo font-bold font-stretch-expanded text-[30px] uppercase tracking-[0.2em]"
            dominantBaseline="central"
            fill="currentColor"
            {...HALO}
          >
            <textPath
              href="#club-plan-cut-centre"
              startOffset={STOUR_LABEL_END}
              textAnchor="end"
            >
              To the Stour
            </textPath>
          </text>
          {[
            { stroke: "white", strokeWidth: 9 },
            { stroke: "currentColor", strokeWidth: 2.5 },
          ].map(({ stroke, strokeWidth }) => (
            <g
              key={stroke}
              stroke={stroke}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
            >
              <path
                d={`M${STOUR_ARROW_TAIL.join(",")} L${STOUR_ARROW_TIP.join(",")}`}
              />
              <path
                d={ARROWHEAD}
                transform={`translate(${STOUR_ARROW_TIP.join(" ")}) rotate(${STOUR_ARROW_ANGLE})`}
              />
            </g>
          ))}
        </g>
      </>
    )}
    underlay={(activeId) => (
      <>
        <path
          className="pointer-events-none"
          d={CLUB_SITE}
          fill="white"
          stroke="none"
        />

        <Dimmed dim={!!activeId}>
          <path d={CANOE_CLUB_FENCE} strokeOpacity="0.75" strokeWidth="2.5" />
          <path
            d={CANOE_CLUB_FENCE_POSTS}
            strokeOpacity="0.5"
            strokeWidth="2"
          />
        </Dimmed>
      </>
    )}
    viewBox={VIEW_BOX}
  />
);
