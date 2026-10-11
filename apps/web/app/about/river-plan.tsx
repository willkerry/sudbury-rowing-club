"use client";

import {
  BOATHOUSE,
  CAR_PARK_OUTLINE,
  CLUB_SITE_OUTLINE,
  CLUBHOUSE,
  LANDING_STAGE,
} from "./club-plan";
import {
  brief,
  Dimmed,
  type Feature,
  fillHit,
  isInside,
  type Line,
  Plan,
  type Point,
  pointAlong,
  polylinePath,
  readableAngle,
  roundedPath,
  scatterTrees,
  type Tree,
  thickHit,
  treeCrown,
  type Vertex,
} from "./plan-kit";

/**
 * Traced from a satellite image, so one unit is roughly 0.7 metres. North is
 * up, and the low bridge to the weir measures 1,500 metres along the river.
 */
const VIEW_BOX = { height: 989, width: 1960, x: 0, y: 0 };

/** A point on a channel’s centre line, and how far it is from there to either bank. */
type Knot = [x: number, y: number, halfWidth: number];

/** The Stour from Ballingdon, past the Cut and round Lady Island, to where it forks at the weir. */
const RIVER_KNOTS: Knot[] = [
  [0, 167, 10.5],
  [63, 194, 10.5],
  [108, 233, 10.5],
  [113, 278, 10.5],
  [116, 330, 11],
  [158, 377, 11.5],
  [210, 404, 12],
  [263, 390, 12.5],
  [326, 367, 13],
  [420, 350, 14],
  [540, 362, 14],
  [603, 355, 14],
  [701, 341, 14],
  [799, 314, 14.5],
  [890, 286, 14.5],
  [1001, 242, 14.5],
  [1102, 230, 14.5],
  [1200, 233, 14.5],
  [1275, 253, 14],
  [1350, 288, 13.5],
  [1427, 345, 13],
  [1505, 405, 13],
  [1567, 460, 13],
  [1622, 514, 13],
  [1669, 577, 13],
  [1700, 632, 13],
  [1732, 694, 13],
  [1755, 764, 13],
  [1771, 827, 13],
  [1782, 889, 12.5],
];

/**
 * The river forks at the weir, which spans the western arm. Each arm starts
 * on the river’s last stretch, so its banks carry on from the river’s.
 */
const WEIR_ARM_KNOTS: Knot[] = [
  [1771, 827, 13],
  [1782, 889, 12.5],
  [1801, 918, 11],
  [1807, 950, 9],
  [1804, 995, 9],
];

const EAST_ARM_KNOTS: Knot[] = [
  [1771, 827, 13],
  [1782, 889, 12.5],
  [1810, 920, 10],
  [1840, 940, 8.5],
  [1866, 962, 8],
  [1895, 995, 8],
];

/** The Cut, from where it narrows north of the club down to the Stour. */
const CUT_KNOTS: Knot[] = [
  [614.9, 141.9, 1.5],
  [587.6, 174, 5.8],
  [575.9, 192.6, 6.8],
  [561.3, 222.8, 6.8],
  [557.4, 241.3, 7.3],
  [559.4, 260.8, 6.3],
  [563, 291, 7.5],
  [570, 325, 9.5],
  [577, 352, 12],
];

/** The arm off the Cut up to the Quay, along the club’s northern edge. */
const QUAY_KNOTS: Knot[] = [
  [496, 178.9, 3.4],
  [497.5, 191.6, 4.9],
  [508.7, 201.3, 6],
  [525.2, 210.1, 6.3],
  [538.9, 216.9, 6.3],
  [561.3, 226.7, 6.8],
];

/** The narrow channel along the club’s southern edge, as the facilities plan shows it. */
const CLUB_DITCH_KNOTS: Knot[] = [
  [560.3, 248.1, 4.4],
  [535, 251.6, 4.2],
  [514.5, 256.9, 3.4],
  [498.9, 260.8, 3.3],
  [478.4, 266.2, 2.5],
  [452.1, 271.1, 2.3],
  [437.5, 274, 1],
];

/**
 * The backwater that leaves the Stour at the top of the big bend and loops
 * round to rejoin it. Lady Island is the land it encloses, so moving these
 * knots reshapes the island.
 */
const BACKWATER_KNOTS: Knot[] = [
  [1180, 212, 6],
  [1186, 170, 5],
  [1190, 120, 5],
  [1200, 82, 5],
  [1222, 56, 5.5],
  [1255, 40, 6],
  [1290, 32, 6.5],
  [1325, 42, 7],
  [1358, 66, 7.5],
  [1380, 98, 8],
  [1389, 150, 8.5],
  [1393, 210, 9],
  [1398, 265, 10],
  [1408, 322, 11],
];

/** The Stour’s other arm, heading north to the town from the top of the backwater. */
const NORTH_ARM_KNOTS: Knot[] = [
  [1286, -10, 6.5],
  [1300, 12, 6.5],
  [1325, 42, 7],
];

/** The old railway line, now a track, from the town across the river and the Cut. */
const TRACK_KNOTS: Knot[] = [
  [0, 262, 4.5],
  [100, 275, 4.5],
  [200, 288, 4.5],
  [315, 296, 4.5],
  [400, 296, 4.5],
  [500, 278, 4.5],
  [603, 250, 4.5],
  [701, 218, 4.5],
  [778, 187, 4.5],
  [850, 150, 4.5],
  [920, 90, 4.5],
  [990, 10, 4.5],
  [1002, -10, 4.5],
];

/** The roads around the river, traced from the satellite image. */
const ROAD_KNOTS: Knot[][] = [
  // Quay Lane, down from the town to the club’s gates.
  [
    [488, -10, 5],
    [490, 96, 5],
    [482, 140, 5],
    [478, 190, 5],
  ],
  // Blackfriars.
  [
    [-10, 108, 4.5],
    [40, 104, 4.5],
    [120, 72, 4.5],
    [182, -10, 4.5],
  ],
  // Catesby Meadow, off Blackfriars.
  [
    [120, 72, 4],
    [180, 132, 4],
    [240, 192, 4],
  ],
  // Kingfishers.
  [
    [160, 112, 4],
    [172, 165, 4],
    [184, 216, 4],
  ],
  // Middleton Road.
  [
    [-10, 816, 5],
    [31, 876, 5],
    [73, 923, 5],
    [121, 965, 5],
    [157, 971, 5],
    [210, 955, 5],
    [247, 955, 5],
    [268, 999, 5],
  ],
  // Cornard Road, then Kings Hill.
  [
    [1733, -10, 5],
    [1797, 42, 5],
    [1860, 77, 5],
    [1888, 155, 5],
    [1917, 232, 5],
    [1959, 317, 5],
    [1987, 423, 5],
    [2001, 502, 5],
    [2012, 700, 5],
  ],
  // Cats Lane.
  [
    [1860, 77, 4.5],
    [1959, -10, 4.5],
  ],
];

/** The railway to Sudbury station, still open, along the far side of the woods. */
const RAILWAY_KNOTS: Knot[] = [
  [1562, -10, 3],
  [1649, 77, 3],
  [1712, 141, 3],
  [1762, 204, 3],
  [1811, 282, 3],
  [1853, 366, 3],
  [1888, 451, 3],
  [1910, 560, 3],
  [1932, 700, 3],
  [1950, 850, 3],
  [1962, 999, 3],
];

/** Farm tracks and footpaths, as single lines. */
const PATHS: Point[][] = [
  // Along the top of Friars Meadow.
  [
    [968, 66],
    [1060, 64],
    [1200, 58],
    [1300, 48],
    [1388, 40],
  ],
  // The quarry road and the track down the edge of the fields.
  [
    [1095, 522],
    [1200, 536],
    [1300, 520],
    [1430, 482],
    [1500, 520],
    [1590, 590],
    [1662, 655],
    [1715, 725],
    [1738, 800],
    [1745, 999],
  ],
  // The track along the edge of the fields south of the river.
  [
    [412, 999],
    [440, 900],
    [537, 800],
    [650, 750],
    [800, 712],
    [875, 690],
    [960, 670],
  ],
];

/** How far the town on the far side of the railway stands back from it. */
const RAILWAY_MARGIN = 22;

/** The built-up edges of the town, shown as areas rather than buildings. */
const TOWN: Point[][] = [
  // Blackfriars and the streets down to the railway line.
  [
    [-10, -10],
    [345, -10],
    [345, 100],
    [330, 150],
    [335, 240],
    [300, 250],
    [200, 254],
    [150, 248],
    [118, 222],
    [96, 196],
    [66, 168],
    [-10, 145],
  ],
  // Around the Quay and the Granary.
  [
    [455, 30],
    [576, -10],
    [904, -10],
    [904, 40],
    [840, 60],
    [800, 100],
    [760, 128],
    [700, 130],
    [620, 112],
    [590, 150],
    [560, 200],
    [500, 200],
    [470, 170],
    [455, 110],
  ],
  // Cornard Road, Chalk Hill and Kings Hill, kept a margin clear of the railway.
  [
    [2010, -10],
    [2010, 999],
    ...RAILWAY_KNOTS.map(([x, y]): Point => [x + RAILWAY_MARGIN, y]).reverse(),
  ],
  // Off Middleton Road.
  [
    [-10, 730],
    [40, 730],
    [75, 780],
    [125, 860],
    [130, 905],
    [100, 930],
    [60, 910],
    [20, 870],
    [-10, 850],
  ],
];

/** The barn at the quarry, the one building standing out in the fields. */
const QUARRY_BARN: Point[] = [
  [752, 505],
  [790, 487],
  [808, 530],
  [770, 549],
];

type Sample = { x: number; y: number; w: number; nx: number; ny: number };

const SAMPLE_STEP = 4;

/**
 * Samples a smooth curve through the knots every few units, with the normal
 * there. It’s a centripetal Catmull–Rom spline, which never loops or
 * overshoots however unevenly the knots are spaced. The normal points to the
 * right, looking along the channel.
 */
const sampleChannel = (knots: Knot[]): Sample[] => {
  const extend = (from: Knot, to: Knot): Knot => [
    2 * from[0] - to[0],
    2 * from[1] - to[1],
    from[2],
  ];
  const [penultimate, last] = knots.slice(-2);
  const all = [extend(knots[0], knots[1]), ...knots, extend(last, penultimate)];
  const points: Knot[] = [];

  for (let i = 1; i < all.length - 2; i++) {
    const p = [all[i - 1], all[i], all[i + 1], all[i + 2]];
    const t = [0];

    for (let k = 1; k < 4; k++) {
      t.push(
        t[k - 1] +
          Math.sqrt(
            Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]) || 1e-6,
          ),
      );
    }

    const lerp = (a: Knot, b: Knot, ta: number, tb: number, u: number) =>
      a.map((v, k) => v + ((b[k] - v) * (u - ta)) / (tb - ta)) as Knot;
    const steps = Math.ceil(
      Math.hypot(p[2][0] - p[1][0], p[2][1] - p[1][1]) / SAMPLE_STEP,
    );

    for (let step = 0; step < steps; step++) {
      const u = t[1] + ((t[2] - t[1]) * step) / steps;
      const a1 = lerp(p[0], p[1], t[0], t[1], u);
      const a2 = lerp(p[1], p[2], t[1], t[2], u);
      const a3 = lerp(p[2], p[3], t[2], t[3], u);
      const b1 = lerp(a1, a2, t[0], t[2], u);
      const b2 = lerp(a2, a3, t[1], t[3], u);

      points.push(lerp(b1, b2, t[1], t[2], u));
    }
  }
  points.push(last);

  return points.map(([x, y, w], i) => {
    const [ax, ay] = points[Math.max(i - 1, 0)];
    const [bx, by] = points[Math.min(i + 1, points.length - 1)];
    const length = Math.hypot(bx - ax, by - ay);

    return { nx: -(by - ay) / length, ny: (bx - ax) / length, w, x, y };
  });
};

/** A point on one bank, or `extra` beyond it. Side 1 is the right bank looking along the channel. */
const bankPoint = ({ nx, ny, w, x, y }: Sample, side: 1 | -1, extra = 0) =>
  [x + nx * side * (w + extra), y + ny * side * (w + extra)] as Point;

const outline = (samples: Sample[], extra = 0): Point[] => [
  ...samples.map((sample) => bankPoint(sample, 1, extra)),
  ...samples.map((sample) => bankPoint(sample, -1, extra)).reverse(),
];

const toPath = polylinePath;

/** Joins up the points, leaving gaps wherever they fall within any of the areas. */
const brokenPath = (points: Point[], areas: Point[][]) => {
  const runs: Point[][] = [];
  let run: Point[] = [];

  for (const point of points) {
    if (areas.some((area) => isInside(point, area))) {
      runs.push(run);
      run = [];
    } else {
      run.push(point);
    }
  }
  runs.push(run);

  return runs
    .filter((run) => run.length > 1)
    .map((run) => toPath(run))
    .join(" ");
};

const nearest = (samples: Sample[], [px, py]: Point) =>
  samples.reduce(
    (best, { x, y }, i) =>
      Math.hypot(x - px, y - py) <
      Math.hypot(samples[best].x - px, samples[best].y - py)
        ? i
        : best,
    0,
  );

const centreLine = (samples: Sample[]) =>
  samples.map(({ x, y }): Point => [x, y]);

const RIVER = sampleChannel(RIVER_KNOTS);
const WEIR_ARM = sampleChannel(WEIR_ARM_KNOTS);
const CUT = sampleChannel(CUT_KNOTS);
const BACKWATER = sampleChannel(BACKWATER_KNOTS);
const TRACK = sampleChannel(TRACK_KNOTS);
const ROADS = ROAD_KNOTS.map((knots) => sampleChannel(knots));
const RAILWAY = sampleChannel(RAILWAY_KNOTS);

const CHANNELS = [
  RIVER,
  WEIR_ARM,
  sampleChannel(EAST_ARM_KNOTS),
  CUT,
  sampleChannel(QUAY_KNOTS),
  sampleChannel(CLUB_DITCH_KNOTS),
  BACKWATER,
  sampleChannel(NORTH_ARM_KNOTS),
];

const OUTLINES = CHANNELS.map((samples) => outline(samples));

/** The club’s plot, scaled down from the facilities plan to sit on the Cut here. */
const CLUB_SCALE = 0.078;
const CLUB_OFFSET: Point = [449, 168];

/** Brings an outline from the facilities plan into this one’s units. */
const fromFacilitiesPlan = (outline: Vertex[]) =>
  outline.map(
    ([x, y, radius]): Vertex => [
      CLUB_OFFSET[0] + x * CLUB_SCALE,
      CLUB_OFFSET[1] + y * CLUB_SCALE,
      radius * CLUB_SCALE,
    ],
  );

const CLUB_SITE = fromFacilitiesPlan(CLUB_SITE_OUTLINE);

/** Quay Lane Car Park, beside the club’s fence, as the facilities plan draws it. */
const CAR_PARK = roundedPath(fromFacilitiesPlan(CAR_PARK_OUTLINE));

/** The club’s fence, its one side not on the water. */
const CLUB_FENCE = [CLUB_SITE[0], ...CLUB_SITE.slice(-1)].map(
  ([x, y]): Point => [x, y],
) as Line;

/**
 * The club’s land is drawn a little oversize and cut back to the water’s
 * edge, so it meets the banks exactly. It stops dead at the fence.
 */
const CLUB_REACH: Point[] = [
  [CLUB_FENCE[0][0], CLUB_FENCE[0][1] - 30],
  [VIEW_BOX.x + VIEW_BOX.width, CLUB_FENCE[0][1] - 30],
  [VIEW_BOX.x + VIEW_BOX.width, CLUB_FENCE[1][1] + 30],
  [CLUB_FENCE[1][0], CLUB_FENCE[1][1] + 30],
];

/** How far a bank must be from the club’s corners to be rounded off where it meets another. */
const CLUB_CORNER_CLEARANCE = 8;

type Bank = { points: Point[]; widths: number[] };

/** Where two banks cross at more than a glancing angle, and the segment of each it falls in. */
const bankCrossings = (a: Bank, b: Bank) => {
  const crossings: { at: Point; m: number; n: number }[] = [];

  for (let m = 0; m < a.points.length - 1; m++) {
    const [[x1, y1], [x2, y2]] = [a.points[m], a.points[m + 1]];

    for (let n = 0; n < b.points.length - 1; n++) {
      const [[x3, y3], [x4, y4]] = [b.points[n], b.points[n + 1]];
      const denominator = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
      const s = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / denominator;
      const t = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / denominator;
      const sine =
        Math.abs(denominator) /
        (Math.hypot(x2 - x1, y2 - y1) * Math.hypot(x4 - x3, y4 - y3));

      if (s >= 0 && s < 1 && t >= 0 && t < 1 && sine > 0.2) {
        crossings.push({ at: [x1 + (x2 - x1) * s, y1 + (y2 - y1) * s], m, n });
      }
    }
  }

  return crossings;
};

/** The point `distance` along a bank from where it crosses another channel’s, heading out of that channel. */
const walkOut = (
  points: Point[],
  segment: number,
  start: Point,
  other: Point[],
  distance: number,
) => {
  const step = isInside(points[segment + 1] ?? start, other) ? -1 : 1;
  let [px, py] = start;
  let left = distance;

  for (let i = step === 1 ? segment + 1 : segment; points[i]; i += step) {
    const [x, y] = points[i];
    const length = Math.hypot(x - px, y - py);

    if (length >= left) {
      return [
        px + ((x - px) * left) / length,
        py + ((y - py) * left) / length,
      ] as Point;
    }
    left -= length;
    [px, py] = [x, y];
  }

  return [px, py] as Point;
};

/** A curve from one point to another, pulled towards a corner between them. */
const curveBy = (from: Point, corner: Point, to: Point) =>
  Array.from({ length: 9 }, (_, k): Point => {
    const u = k / 8;

    return [0, 1].map(
      (axis) =>
        (1 - u) ** 2 * from[axis] +
        2 * u * (1 - u) * corner[axis] +
        u ** 2 * to[axis],
    ) as Point;
  });

const BANKS = CHANNELS.map((samples) =>
  ([1, -1] as const).map(
    (side): Bank => ({
      points: samples.map((sample) => bankPoint(sample, side)),
      widths: samples.map(({ w }) => w),
    }),
  ),
);

/**
 * Where one channel’s bank crosses another’s, the land between them comes to
 * a point. Each fillet is the sliver of that point to be given over to the
 * water, so channels join in a smooth curve. The club’s own corners stay sharp.
 */
const FILLETS = CHANNELS.flatMap((_, i) =>
  CHANNELS.slice(i + 1).flatMap((_, offset) => {
    const j = i + 1 + offset;

    return BANKS[i].flatMap((a) =>
      BANKS[j].flatMap((b) =>
        bankCrossings(a, b)
          .filter(({ at: [cx, cy] }) =>
            CLUB_SITE.every(
              ([x, y]) => Math.hypot(x - cx, y - cy) >= CLUB_CORNER_CLEARANCE,
            ),
          )
          .map(({ at, m, n }) => {
            const radius = Math.min(
              10,
              0.8 * Math.min(a.widths[m], b.widths[n]),
            );

            return [
              at,
              ...curveBy(
                walkOut(a.points, m, at, OUTLINES[j], radius),
                at,
                walkOut(b.points, n, at, OUTLINES[i], radius),
              ),
            ];
          }),
      ),
    );
  }),
);

/** The flooded quarry south of the river, beyond the meadow. */
const POND = Array.from({ length: 48 }, (_, i): Point => {
  const angle = (i / 48) * Math.PI * 2;

  return [
    1025 + 64 * Math.cos(angle) * (1 + 0.05 * Math.sin(3 * angle)),
    588 + 56 * Math.sin(angle),
  ];
});

/** Every stretch of water, drawn as one so channels merge where they meet. */
const WATER_AREAS = [...OUTLINES, ...FILLETS, POND];

/** Turns every area the same way round, so they combine rather than cancel where they overlap. */
const clockwise = (points: Point[]) => {
  const area = points.reduce(
    (sum, [x, y], i) =>
      sum +
      (points[(i + 1) % points.length][0] - x) *
        (points[(i + 1) % points.length][1] + y),
    0,
  );

  return area < 0 ? points : [...points].reverse();
};

const WATER = WATER_AREAS.map((area) => toPath(clockwise(area), true)).join(
  " ",
);

/** Drawn once and reused for the water’s banks, its fill and the club’s mask. */
const WATER_ID = "river-plan-water";

const BANK_WIDTH = 2;

const WATER_FILL = "fill-blue-100";

/** Where the track runs over water, with a little to spare at each end. */
const BRIDGE_OVERHANG = 2;

const BRIDGES = TRACK.reduce<{ from: number; to: number }[]>(
  (bridges, sample, i) => {
    if (!OUTLINES.some((area) => isInside([sample.x, sample.y], area))) {
      return bridges;
    }

    const last = bridges.at(-1);

    if (last && last.to >= i - BRIDGE_OVERHANG * 2) {
      last.to = i + BRIDGE_OVERHANG;
    } else {
      bridges.push({ from: i - BRIDGE_OVERHANG, to: i + BRIDGE_OVERHANG });
    }

    return bridges;
  },
  [],
);

const PARAPET = 3;

const bridgeDrawing = ({ from, to }: { from: number; to: number }) => {
  const span = TRACK.slice(from, to + 1);
  const wings = [
    { end: TRACK[from], out: -1 },
    { end: TRACK[to], out: 1 },
  ].flatMap(({ end, out }) =>
    ([1, -1] as const).map((side) => {
      const [x, y] = bankPoint(end, side, PARAPET);
      const [dx, dy] = [-end.ny * out * 7, end.nx * out * 7];

      return `M${x.toFixed(1)},${y.toFixed(1)} l${(dx + end.nx * side * 6).toFixed(1)},${(dy + end.ny * side * 6).toFixed(1)}`;
    }),
  );

  return (
    <>
      <path
        className="fill-meadow"
        d={toPath(outline(span, PARAPET), true)}
        stroke="none"
      />
      {([1, -1] as const).map((side) => (
        <path
          d={toPath(span.map((sample) => bankPoint(sample, side, PARAPET)))}
          key={side}
          strokeOpacity="0.6"
          strokeWidth="2"
        />
      ))}
      <path d={wings.join(" ")} strokeOpacity="0.6" strokeWidth="2" />
    </>
  );
};

/** The low bridge at the far end of the club’s water, where the track crosses the Stour. */
const LOW_BRIDGE = BRIDGES.reduce((best, bridge) =>
  Math.abs(TRACK[bridge.from].x - 113) < Math.abs(TRACK[best.from].x - 113)
    ? bridge
    : best,
);

/** The track’s edges stop where each bridge’s parapets take over. */
const TRACK_EDGES = ([1, -1] as const)
  .map((side) =>
    brokenPath(
      TRACK.map((sample) => bankPoint(sample, side)),
      BRIDGES.map(({ from, to }) =>
        outline(TRACK.slice(from + 1, to), PARAPET + 2),
      ),
    ),
  )
  .join(" ");

/** Land meets water a few units back from the bank line. */
const SHORE = 4;

const RIVER_SHORE = outline(RIVER, SHORE);
const BACKWATER_SHORE = outline(BACKWATER, SHORE);

const LADY_ISLAND: Point[] = [
  ...BACKWATER.map((sample) => bankPoint(sample, 1, SHORE)).filter(
    (point) => !isInside(point, RIVER_SHORE),
  ),
  ...RIVER.slice(nearest(RIVER, [1180, 212]), nearest(RIVER, [1408, 322]) + 1)
    .map((sample) => bankPoint(sample, -1, SHORE))
    .filter((point) => !isInside(point, BACKWATER_SHORE))
    .reverse(),
];

/**
 * Friars Meadow, between the river, the old railway line and the path along
 * its top, up to the backwater around Lady Island.
 */
const FRIARS_MEADOW: Point[] = [
  [615, 345],
  [700, 332],
  [800, 304],
  [900, 276],
  [1000, 238],
  [1100, 224],
  [1170, 222],
  [1174, 150],
  [1170, 74],
  [1100, 72],
  [1000, 68],
  [968, 52],
  [926, 98],
  [856, 158],
  [782, 194],
  [705, 226],
  [608, 258],
];

/** Along the meadow, parallel to the river. */
const FRIARS_MEADOW_AXIS: Line = [
  [760, 262],
  [1060, 168],
];

/** Across the middle of Lady Island, roughly parallel to the river below it. */
const LADY_ISLAND_AXIS: Line = [
  [1215, 150],
  [1370, 185],
];

/**
 * Woodland traced from the satellite image, as plain outlines in plan units so
 * they’re easy to move. Trees keep clear of the water, so the outlines can run
 * out over it.
 */
const WOODS: Point[][] = [
  // Lady Island and the bank above the backwater.
  [
    [1168, 64],
    [1250, 30],
    [1335, 34],
    [1402, 88],
    [1414, 200],
    [1414, 300],
    [1340, 280],
    [1250, 248],
    [1172, 222],
  ],
  // South of the big bend, and on down the south-west bank to the weir.
  [
    [1162, 252],
    [1260, 262],
    [1350, 300],
    [1440, 360],
    [1520, 425],
    [1600, 500],
    [1660, 575],
    [1712, 660],
    [1745, 750],
    [1765, 840],
    [1795, 930],
    [1790, 989],
    [1745, 989],
    [1738, 850],
    [1712, 752],
    [1662, 712],
    [1587, 650],
    [1525, 587],
    [1475, 525],
    [1425, 490],
    [1300, 495],
    [1162, 470],
  ],
  // The north-east bank, widening into the woods below Kings Hill.
  [
    [1405, 290],
    [1460, 335],
    [1520, 390],
    [1580, 445],
    [1640, 510],
    [1690, 580],
    [1730, 655],
    [1760, 735],
    [1780, 815],
    [1795, 890],
    [1830, 950],
    [1850, 989],
    [1885, 989],
    [1885, 880],
    [1885, 720],
    [1875, 560],
    [1860, 450],
    [1820, 370],
    [1760, 345],
    [1712, 400],
    [1680, 465],
    [1640, 470],
    [1590, 430],
    [1520, 368],
    [1450, 300],
  ],
  // Between the railway line and the river, west of the Cut.
  [
    [95, 300],
    [120, 286],
    [250, 293],
    [400, 300],
    [500, 284],
    [600, 262],
    [610, 350],
    [500, 352],
    [400, 348],
    [300, 372],
    [205, 402],
    [140, 372],
    [100, 330],
  ],
  // The wood south of the river, on the Essex side.
  [
    [320, 560],
    [380, 535],
    [450, 520],
    [520, 525],
    [590, 560],
    [610, 620],
    [600, 700],
    [560, 760],
    [500, 810],
    [440, 880],
    [410, 950],
    [400, 989],
    [300, 989],
    [250, 940],
    [200, 880],
    [185, 800],
    [230, 740],
    [290, 700],
    [310, 620],
  ],
];

/** Trees stand clear of the water, though their crowns may lean out over it. */
const TREE_CLEARANCE = 4;

/** How far houses and trees stand back from the roads and the railway. */
const ROAD_CLEARANCE = 5;

const ROAD_MARGINS = [...ROADS, RAILWAY, TRACK].map((samples) =>
  outline(samples, ROAD_CLEARANCE),
);

const CROWN_RADIUS = 14;

const TREES = WOODS.flatMap((wood) =>
  scatterTrees(wood, {
    r: CROWN_RADIUS,
    spacing: 22,
    clear: [
      ...CHANNELS.map((samples) => outline(samples, TREE_CLEARANCE)),
      ...ROAD_MARGINS,
      ...TOWN,
      POND,
    ],
  }),
);

/** Places a shared crown for one tree, turned so neighbours using the same shape don’t match. */
const treeTransform = ({ r, x, y }: Tree, i: number) => {
  const turn = (i * 137) % 360;

  return [
    `translate(${brief(x)} ${brief(y)})`,
    turn ? `rotate(${turn})` : "",
    `scale(${Number((r / CROWN_RADIUS).toFixed(2))})`,
  ].join("");
};

/**
 * A handful of crown shapes, drawn once and reused, turned and scaled, for
 * every tree, so the woods don’t each carry their own outline.
 */
const CROWNS = Array.from({ length: 12 }, (_, i) =>
  treeCrown({ r: CROWN_RADIUS, x: 0, y: 0 }, i + 1),
);

const CUT_AREA = toPath(outline(CUT), true);

/** The middle of the Cut, below where it bends away north, reading down towards the Stour. */
const CUT_LABEL_PATH = toPath(
  centreLine(
    CUT.slice(nearest(CUT, [575.9, 192.6]), nearest(CUT, [570, 325]) + 1),
  ),
);

/** The weir, across the western arm, and the lip of its drop just downstream. */
const WEIR = WEIR_ARM[nearest(WEIR_ARM, [1806, 936])];
const WEIR_LIP = WEIR_ARM[nearest(WEIR_ARM, [1807, 944])];

const acrossChannel = (sample: Sample, extra = 0) =>
  toPath([bankPoint(sample, -1, extra), bankPoint(sample, 1, extra)]);

/**
 * Across the Cut from the club, in the open ground between its head and the
 * old railway line, as the club itself is too small to hold its name.
 */
const CLUB_LABEL_AT: Point = [592, 204];

/** How far the labels set beside small features stand off from them. */
const LABEL_GAP = 10;

const MEADOW_HALO = "stroke-meadow";

const FEATURES: Feature[] = [
  {
    description:
      "Home of Sudbury Regatta, just across the water from the club.",
    drawing: null,
    highlight: (
      <path
        d={toPath(FRIARS_MEADOW, true)}
        fill="currentColor"
        fillOpacity="0.08"
        stroke="none"
      />
    ),
    hit: fillHit(toPath(FRIARS_MEADOW, true)),
    id: "meadow",
    name: "Friars Meadow",
    label: {
      angle: readableAngle(FRIARS_MEADOW_AXIS),
      at: pointAlong(FRIARS_MEADOW_AXIS, 0.5),
      halo: MEADOW_HALO,
      permanent: true,
      size: 20,
    },
  },
  {
    description: "Our triangle of land at the end of Quay Lane.",
    drawing: (
      <>
        <defs>
          <mask
            height={VIEW_BOX.height}
            id="river-plan-club-land"
            maskUnits="userSpaceOnUse"
            width={VIEW_BOX.width}
            x={VIEW_BOX.x}
            y={VIEW_BOX.y}
          >
            <path d={toPath(CLUB_REACH, true)} fill="white" stroke="none" />
            <use
              fill="black"
              href={`#${WATER_ID}`}
              stroke="black"
              strokeWidth="4"
            />
          </mask>
        </defs>
        <g mask="url(#river-plan-club-land)">
          <path
            d={roundedPath(CLUB_SITE)}
            fill="white"
            stroke="white"
            strokeWidth="6"
          />
        </g>
        <path d={toPath(CLUB_FENCE)} strokeOpacity="0.75" strokeWidth="2" />
        <g
          fill="currentColor"
          fillOpacity="0.14"
          strokeOpacity="0.7"
          transform={`translate(${CLUB_OFFSET.join(" ")}) scale(${CLUB_SCALE})`}
        >
          {[BOATHOUSE, CLUBHOUSE].map((building) => (
            <path
              d={building}
              key={building}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path
            d={LANDING_STAGE}
            fillOpacity="0.6"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </>
    ),
    hit: (
      <>
        {fillHit(roundedPath(CLUB_SITE))}
        {thickHit(roundedPath(CLUB_SITE), 12)}
      </>
    ),
    id: "club",
    name: "The Club",
    label: {
      anchor: "start",
      angle: 0,
      at: CLUB_LABEL_AT,
      halo: MEADOW_HALO,
      permanent: true,
      size: 16,
    },
  },
  {
    description: "A man-made channel off the River Stour.",
    drawing: null,
    highlight: (
      <>
        <path className={WATER_FILL} d={CUT_AREA} stroke="none" />
        <path
          d={CUT_AREA}
          fill="currentColor"
          fillOpacity="0.1"
          stroke="none"
        />
        <path
          d={([1, -1] as const)
            .map((side) =>
              brokenPath(
                CUT.map((sample) => bankPoint(sample, side)),
                WATER_AREAS.filter((area) => area !== OUTLINES[3]),
              ),
            )
            .join(" ")}
          strokeWidth={BANK_WIDTH}
        />
      </>
    ),
    hit: (
      <>
        {fillHit(CUT_AREA)}
        {thickHit(toPath(centreLine(CUT)), 20)}
      </>
    ),
    id: "cut",
    label: { halo: "stroke-blue-100", path: CUT_LABEL_PATH, size: 16 },
    name: "The Cut",
  },
  {
    description: "Wooded, and ringed by a loop of the river.",
    drawing: null,
    highlight: (
      <path
        d={toPath(LADY_ISLAND, true)}
        fill="currentColor"
        fillOpacity="0.08"
        stroke="none"
      />
    ),
    hit: fillHit(toPath(LADY_ISLAND, true)),
    id: "lady-island",
    name: "Lady Island",
    label: {
      angle: readableAngle(LADY_ISLAND_AXIS),
      at: pointAlong(LADY_ISLAND_AXIS, 0.5),
      halo: MEADOW_HALO,
      size: 18,
    },
  },
  {
    description: "The upstream end of our water.",
    drawing: bridgeDrawing(LOW_BRIDGE),
    hit: thickHit(
      toPath(centreLine(TRACK.slice(LOW_BRIDGE.from, LOW_BRIDGE.to + 1))),
      30,
    ),
    id: "low-bridge",
    name: "A low bridge",
    label: {
      anchor: "start",
      angle: readableAngle([
        [TRACK[LOW_BRIDGE.to].x, TRACK[LOW_BRIDGE.to].y],
        [315, 296],
      ]),
      at: [150, 262],
      halo: MEADOW_HALO,
      size: 16,
    },
  },
  {
    description: "The downstream end of our water.",
    drawing: (
      <>
        <path
          d={acrossChannel(WEIR, 4)}
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d={acrossChannel(WEIR_LIP, 2)}
          strokeLinecap="round"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
      </>
    ),
    hit: thickHit(acrossChannel(WEIR, 4), 30),
    id: "weir",
    name: "The weir",
    label: {
      anchor: "end",
      angle: 0,
      at: [bankPoint(WEIR, 1)[0] - LABEL_GAP, WEIR.y],
      halo: MEADOW_HALO,
      size: 16,
    },
  },
];

/** Lists the features in the order a crew meets them on the way out. */
const LEGEND = ["club", "cut", "low-bridge", "meadow", "lady-island", "weir"];

/** Drawn for context, but not interactive. */
const SCENERY = (
  <>
    <path
      d={TRACK_EDGES}
      strokeDasharray="12 8"
      strokeOpacity="0.5"
      strokeWidth="2"
    />
    {BRIDGES.filter((bridge) => bridge !== LOW_BRIDGE).map((bridge) => (
      <g key={bridge.from}>{bridgeDrawing(bridge)}</g>
    ))}
  </>
);

/** The water and the woods beneath everything else. */
const GROUND = (
  <>
    <path
      className="fill-gray-200"
      d={TOWN.map((area) =>
        roundedPath(area.map(([x, y]): Vertex => [x, y, 14])),
      ).join(" ")}
      strokeOpacity="0.3"
      strokeWidth="1.5"
    />
    <path
      d={toPath(QUARRY_BARN, true)}
      fill="white"
      strokeOpacity="0.55"
      strokeWidth="1.5"
    />
    <path
      d={PATHS.map((points) => toPath(points)).join(" ")}
      strokeDasharray="5 5"
      strokeOpacity="0.4"
      strokeWidth="1.5"
    />
    <g strokeLinecap="round" strokeLinejoin="round">
      {ROADS.map((samples) => (
        <path
          d={toPath(centreLine(samples))}
          key={`edge-${samples[0].x},${samples[0].y}`}
          strokeOpacity="0.4"
          strokeWidth={samples[0].w * 2 + 3}
        />
      ))}
      {ROADS.map((samples) => (
        <path
          d={toPath(centreLine(samples))}
          key={`fill-${samples[0].x},${samples[0].y}`}
          stroke="white"
          strokeWidth={samples[0].w * 2}
        />
      ))}
    </g>
    <path d={CAR_PARK} fill="white" strokeOpacity="0.45" strokeWidth="1.5" />
    <path
      d={toPath(centreLine(RAILWAY))}
      strokeDasharray="1.5 6"
      strokeOpacity="0.45"
      strokeWidth="8"
    />
    <path
      d={toPath(centreLine(RAILWAY))}
      strokeOpacity="0.55"
      strokeWidth="2"
    />
    <use
      href={`#${WATER_ID}`}
      strokeOpacity="0.5"
      strokeWidth={BANK_WIDTH * 2}
    />
    <use className={WATER_FILL} href={`#${WATER_ID}`} stroke="none" />
    <defs>
      <path d={WATER} id={WATER_ID} />
      {CROWNS.map((crown, i) => (
        <path
          d={crown}
          id={`river-plan-crown-${i}`}
          key={crown}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </defs>
    <g className="fill-wood" strokeOpacity="0.5" strokeWidth="1.25">
      {TREES.map(({ r, x, y }, i) => (
        <use
          href={`#river-plan-crown-${i % CROWNS.length}`}
          key={`${x},${y}`}
          transform={treeTransform({ r, x, y }, i)}
        />
      ))}
    </g>
  </>
);

export const RiverPlan = ({ className }: { className?: string }) => (
  <Plan
    ariaLabel="Plan of the club’s stretch of the River Stour"
    className={className}
    features={FEATURES}
    legend={LEGEND}
    overlay={(activeId) => <Dimmed dim={!!activeId}>{SCENERY}</Dimmed>}
    panelPosition="md:bottom-3 md:left-[42%]"
    underlay={(activeId) => <Dimmed dim={!!activeId}>{GROUND}</Dimmed>}
    viewBox={VIEW_BOX}
  />
);
