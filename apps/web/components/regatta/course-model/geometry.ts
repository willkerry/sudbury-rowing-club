import * as k from "@/components/iso/iso-kit";
import type { Flat, Plan, Plane, Point3 } from "@/components/iso/iso-kit";
import {
  BEND_FROM,
  COURSES,
  type CourseId,
  RIVER_FROM,
  RIVER_TO,
  STEP,
  offsetAt,
  pointAt,
  widthAt as trueWidth,
} from "./course";
import {
  BOARD,
  EX,
  HEIGHT,
  M,
  MODEL,
  P,
  WIDTH,
  Z_LAND,
  Z_WATER,
  w,
} from "./view";

const widthAt = (at: number) => trueWidth(at) * EX;
const Z_BOARD = -4;

const at3 = ([x, y]: Plane, z: number): Point3 => [x, y, z];
const depth = (p: Plane, z = 0) => k.depthOf(at3(p, z), P);
const project = (ring: Plane[], z: number) =>
  ring.map((p) => k.iso(at3(p, z), P));
const closed = (ring: Plane[], z: number) => k.pathOf(project(ring, z), true);
const open = (line: Plane[], z: number) => k.pathOf(project(line, z));

const mulberry = (seed: number) => {
  let a = seed;

  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const inside = ([x, y]: Plane, ring: Plane[]) => {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      hit = !hit;
  }

  return hit;
};

const clipToRect = (ring: Plane[], { x, y, w: width, d }: Plan): Plane[] => {
  const edges: [(p: Plane) => boolean, (a: Plane, b: Plane) => Plane][] = [
    [
      (p) => p[0] >= x,
      (a, b) => [x, a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])],
    ],
    [
      (p) => p[0] <= x + width,
      (a, b) => [
        x + width,
        a[1] + ((b[1] - a[1]) * (x + width - a[0])) / (b[0] - a[0]),
      ],
    ],
    [
      (p) => p[1] >= y,
      (a, b) => [a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]), y],
    ],
    [
      (p) => p[1] <= y + d,
      (a, b) => [
        a[0] + ((b[0] - a[0]) * (y + d - a[1])) / (b[1] - a[1]),
        y + d,
      ],
    ],
  ];
  let out = ring;
  for (const [keep, cross] of edges) {
    const next: Plane[] = [];
    for (let i = 0; i < out.length; i++) {
      const a = out[i];
      const b = out[(i + 1) % out.length];
      if (keep(a)) {
        next.push(a);
        if (!keep(b)) next.push(cross(a, b));
      } else if (keep(b)) next.push(cross(a, b));
    }
    out = next;
  }

  return out;
};

const inModel = ([x, y]: Plane) =>
  x >= MODEL.x &&
  x <= MODEL.x + MODEL.w &&
  y >= MODEL.y &&
  y <= MODEL.y + MODEL.d;

const resample = (points: Plane[], spacing: number) => {
  const out: Plane[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const n = Math.max(
      1,
      Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / spacing),
    );
    for (let j = 1; j <= n; j++)
      out.push([
        a[0] + ((b[0] - a[0]) * j) / n,
        a[1] + ((b[1] - a[1]) * j) / n,
      ]);
  }

  return out;
};

const smoothLine = (points: Plane[], passes = 3) => {
  let out = points;
  for (let pass = 0; pass < passes; pass++) {
    out = out.map((p, i) => {
      if (i === 0 || i === out.length - 1) return p;
      const a = out[i - 1];
      const b = out[i + 1];

      return [
        (a[0] + 2 * p[0] + b[0]) / 4,
        (a[1] + 2 * p[1] + b[1]) / 4,
      ] as Plane;
    });
  }

  return out;
};

// A side stream as a centreline with a width, in metres.
type Stream = { line: Plane[]; width: number };

const banksOf = ({ line, width }: Stream) => {
  const pts = smoothLine(resample(line, 2));
  const left: Plane[] = [];
  const right: Plane[] = [];
  for (const [i, p] of pts.entries()) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const h = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const [le, ls] = [Math.sin(h), -Math.cos(h)];
    left.push(w([p[0] + (le * width * EX) / 2, p[1] + (ls * width * EX) / 2]));
    right.push(w([p[0] - (le * width * EX) / 2, p[1] - (ls * width * EX) / 2]));
  }

  return { left, right };
};

const mainBanks = () => {
  const left: Plane[] = [];
  const right: Plane[] = [];
  for (let at = RIVER_FROM; at <= RIVER_TO; at += STEP) {
    left.push(w(offsetAt(at, widthAt(at) / 2)));
    right.push(w(offsetAt(at, -widthAt(at) / 2)));
  }

  return { left, right };
};

const CUT: Stream = {
  line: [offsetAt(-28, 0), [-31, -30], [-38, -62], [-44, -88], [-46, -100]],
  width: 10,
};
const MILL: Stream = {
  line: [offsetAt(332, 0), [330, -105], [334, -150], [345, -200]],
  width: 9,
};
const BACKWATER: Stream = {
  line: [
    [331, -118],
    [385, -142],
    [448, -134],
    [500, -96],
    [528, -40],
    offsetAt(560, 0),
  ],
  width: 8,
};
const STREAMS = [CUT, MILL, BACKWATER];

const BASIN: Plane[] = k.ringOf(
  { d: 30 / M, r: 2, w: 34 / M, x: -64 / M, y: -128 / M },
  4,
);
const POND: Plane[] = k
  .circleRing(300 / M, 128 / M, 22 / M, 36)
  .map(([x, y]) => [x + Math.sin(y * 0.9) * 0.9, y * 1.0] as Plane);

type Channel = { ring: Plane[]; edges: Plane[][] };

const channels = (): Channel[] => {
  const main = mainBanks();
  const side = STREAMS.map(banksOf);
  const rings = [
    [...main.left, ...[...main.right].reverse()],
    ...side.map((b) => [...b.left, ...[...b.right].reverse()]),
    BASIN,
    POND,
  ];
  const all = rings.map((ring) => clipToRect(ring, MODEL));
  const lines = [
    main.left,
    main.right,
    ...side.flatMap((b) => [b.left, b.right]),
  ];
  const owner = [0, 0, 1, 1, 2, 2, 3, 3];
  const runs: Plane[][] = [];
  for (const [index, line] of lines.entries()) {
    const buried = (p: Plane) =>
      !inModel(p) ||
      all.some((ring, r) => r !== owner[index] && inside(p, ring));
    // Bisect to where a bank line meets the edge it runs into, so it ends on that edge.
    const edge = (open: Plane, shut: Plane) => {
      let a = open;
      let b = shut;
      for (let step = 0; step < 14; step++) {
        const m: Plane = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        if (buried(m)) b = m;
        else a = m;
      }

      return b;
    };
    let run: Plane[] = [];
    let last: Plane | null = null;
    for (const p of line) {
      if (buried(p)) {
        if (run.length > 0 && last) run.push(edge(last, p));
        if (run.length > 1) runs.push(run);
        run = [];
      } else {
        if (run.length === 0 && last) run.push(edge(p, last));
        run.push(p);
      }
      last = p;
    }
    if (run.length > 1) runs.push(run);
  }
  const lonely = (ring: Plane[]) => {
    const wet = (p: Plane) =>
      all.some((other) => other !== ring && inside(p, other));
    const start = ring.findIndex(
      (p, i) => wet(ring[(i + ring.length - 1) % ring.length] ?? p) && !wet(p),
    );
    if (start < 0) return [...ring, ...ring.slice(0, 1)];
    const run: Plane[] = [];
    const edge = (dry: Plane, sunk: Plane) => {
      let a = dry;
      let b = sunk;
      for (let step = 0; step < 14; step++) {
        const m: Plane = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        if (wet(m)) b = m;
        else a = m;
      }

      return b;
    };
    const before = ring[(start + ring.length - 1) % ring.length] ?? ring[start];
    run.push(edge(ring[start] ?? before, before));
    for (let step = 0; step < ring.length; step++) {
      const p = ring[(start + step) % ring.length] ?? before;
      if (wet(p)) {
        run.push(edge(run.at(-1) ?? p, p));
        break;
      }
      run.push(p);
    }

    return run;
  };
  const basinRun = lonely(all[4]);

  return [
    { edges: runs, ring: all[0] },
    ...all.slice(1).map((ring) => ({ edges: [] as Plane[][], ring })),
  ].map((c, i) =>
    i === 4
      ? { ...c, edges: [basinRun] }
      : i === 5
        ? { ...c, edges: [[...all[5], all[5][0]]] }
        : c,
  );
};

const CHANNELS = channels();
const WATER_RINGS = CHANNELS.map((c) => c.ring);
const BANK_EDGES = CHANNELS.flatMap((c) => c.edges);

const nearWater = (p: Plane, by: number) => {
  for (const ring of WATER_RINGS) {
    if (inside(p, ring)) return true;
    for (const q of ring)
      if (Math.hypot(q[0] - p[0], q[1] - p[1]) < by) return true;
  }

  return false;
};

const rotRect = (
  [cx, cy]: Plane,
  length: number,
  breadth: number,
  angle: number,
): Plane[] => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const hl = length / 2;
  const hb = breadth / 2;

  return [
    [-hl, -hb],
    [hl, -hb],
    [hl, hb],
    [-hl, hb],
  ].map(([u, v]) => [cx + u * c - v * s, cy + u * s + v * c]);
};

type Item = { key: number; svg: string };

const solid = (paths: k.SolidPaths, style: k.SolidStyle = {}) =>
  k.solidSvg(paths, style);
const line = (d: string, style: k.LineStyle = {}) => k.lineSvg(d, style);

// Trees: a trunk and a ball crown, shaded with a lit cap and a shade crescent.
const treeSvg = ([x, y]: Plane, size: number) => {
  const trunk = k.cylinder(x, y, 0.32 * size, Z_LAND, 1.6 * size, P, 10);
  const centre = k.iso([x, y, Z_LAND + 1.6 * size + 1.7 * size], P);
  const r = 1.85 * size * P.scale * Math.sqrt(1.6);
  const [cx, cy] = centre;
  const shade = `M${(cx - r).toFixed(1)} ${cy.toFixed(1)}A${r.toFixed(1)} ${r.toFixed(1)} 0 0 0 ${(cx + r).toFixed(1)} ${cy.toFixed(1)}A${r.toFixed(1)} ${(r * 0.62).toFixed(1)} 0 0 1 ${(cx - r).toFixed(1)} ${cy.toFixed(1)}Z`;
  const cap = `M${(cx - r * 0.55).toFixed(1)} ${(cy - r * 0.42).toFixed(1)}A${(r * 0.6).toFixed(1)} ${(r * 0.38).toFixed(1)} -18 0 1 ${(cx + r * 0.35).toFixed(1)} ${(cy - r * 0.72).toFixed(1)}`;

  return `<g class="cm-tree">${solid(trunk, { crease: "none", tone: "lo" })}<circle class="iso-fill" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/><path class="iso-shade" data-shade="1" d="${shade}"/><path class="iso-line" data-tone="faint" d="${cap}" data-free=""/><circle class="iso-line" data-tone="mid" cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/></g>`;
};

const scatter = (
  seed: number,
  count: number,
  region: (rand: () => number) => Plane | null,
  spacing: number,
  clear = 3.2,
) => {
  const rand = mulberry(seed);
  const out: [Plane, number][] = [];
  for (let tries = 0; tries < count * 30 && out.length < count; tries++) {
    const p = region(rand);
    if (!p || !inModel(p)) continue;
    if (
      p[0] < MODEL.x + 3 ||
      p[0] > MODEL.x + MODEL.w - 3 ||
      p[1] < MODEL.y + 3 ||
      p[1] > MODEL.y + MODEL.d - 3
    )
      continue;
    if (nearWater(p, clear)) continue;
    if (out.some(([q]) => Math.hypot(q[0] - p[0], q[1] - p[1]) < spacing))
      continue;
    out.push([p, 0.75 + rand() * 0.4]);
  }

  return out;
};

const along =
  (from: number, to: number, side: 1 | -1, near: number, far: number) =>
  (rand: () => number) => {
    const a = from + rand() * (to - from);
    const by = side * (widthAt(a) / 2 + near + rand() * (far - near));

    return w(offsetAt(a, by));
  };

const ISLAND: [number, number][] = [
  ...MILL.line.slice(0, 2),
  ...BACKWATER.line,
  ...Array.from({ length: 58 }, (_, i) => offsetAt(560 - i * 4, 0)),
];
const LADY_ISLAND = (rand: () => number): Plane | null => {
  const p: [number, number] = [330 + rand() * 200, -130 + rand() * 140];

  return inside(p, ISLAND) ? w(p) : null;
};

const H1: Plane[] = [
  w([-112, 74]),
  w([-30, 66]),
  w([40, 48]),
  w(offsetAt(82, -18)),
];
const H2: Plane[] = [
  w([96, 172]),
  w([150, 112]),
  w([178, 64]),
  w(offsetAt(196, -18)),
];
const H3: Plane[] = [w([468, 172]), w([446, 96]), w(offsetAt(484, -22))];
const H4: Plane[] = [w([-112, 128]), w([-40, 132]), w([30, 150]), w([60, 172])];
const hedges: Plane[][] = [H1, H2, H3, H4];

const hedgerow = (seed: number, line: Plane[], every: number) => {
  const rand = mulberry(seed);
  const pts = resample(line, 0.5);
  const out: [Plane, number][] = [];
  for (
    let i = Math.floor(every / 2);
    i < pts.length;
    i += every + Math.floor(rand() * every * 0.6)
  ) {
    const p = pts[i];
    if (inModel(p) && !nearWater(p, 3.2)) out.push([p, 0.8 + rand() * 0.35]);
  }

  return out;
};

const TREES: [Plane, number][] = [
  ...scatter(11, 26, along(470, 800, 1, 9, 40), 2.6),
  ...scatter(12, 22, along(480, 800, -1, 9, 34), 2.6),
  ...scatter(13, 30, LADY_ISLAND, 2.4, 2.6),
  ...scatter(
    14,
    34,
    (rand) => {
      const x = 20 + rand() * 300;
      return w([x, -96 - x * 0.12 - 6 - rand() * 26]);
    },
    2.6,
  ),
  ...scatter(15, 7, (rand) => w([-130 + rand() * 60, 30 + rand() * 30]), 3.6),
  ...scatter(16, 9, (rand) => w([60 + rand() * 360, 88 + rand() * 8]), 3.6),
  ...scatter(17, 6, (rand) => w([180 + rand() * 6, 30 + rand() * 150]), 3.4),
  ...hedges.flatMap((h, i) => hedgerow(30 + i, h, 22)),
  ...scatter(19, 22, along(20, 340, -1, 6, 11), 3.2, 1.5).map(
    ([p, size]): [Plane, number] => [p, size * 0.55],
  ),
];

// Second World War pill boxes along the Essex bank and the lower reach.
const PILL_BOXES: Plane[] = [
  w([-80, 58]),
  w(offsetAt(175, -34)),
  w(offsetAt(700, 40)),
  w(offsetAt(742, 34)),
];

const pillBox = ([x, y]: Plane) => {
  const ring = Array.from(
    { length: 6 },
    (_, i) =>
      [
        x + 2.1 * Math.cos((i * Math.PI) / 3 + 0.3),
        y + 2.1 * Math.sin((i * Math.PI) / 3 + 0.3),
      ] as Plane,
  );
  const roof = Array.from(
    { length: 6 },
    (_, i) =>
      [
        x + 2.4 * Math.cos((i * Math.PI) / 3 + 0.3),
        y + 2.4 * Math.sin((i * Math.PI) / 3 + 0.3),
      ] as Plane,
  );
  const body = k.extrude(ring, Z_LAND, 1.5, P);
  const cap = k.extrude(roof, Z_LAND + 1.5, 0.45, P, { bevel: 0.25 });
  const [vx, vy] = k.towardViewer(P);
  const slits: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % 6];
    const nx = (a[0] + b[0]) / 2 - x;
    const ny = (a[1] + b[1]) / 2 - y;
    if (nx * vx + ny * vy < 0.6) continue;
    const m: Plane = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const u: Plane = [(b[0] - a[0]) * 0.22, (b[1] - a[1]) * 0.22];
    const z0 = Z_LAND + 0.8;
    const z1 = Z_LAND + 1.05;
    slits.push(
      k.pathOf(
        [
          k.iso([m[0] - u[0], m[1] - u[1], z0], P),
          k.iso([m[0] + u[0], m[1] + u[1], z0], P),
          k.iso([m[0] + u[0], m[1] + u[1], z1], P),
          k.iso([m[0] - u[0], m[1] - u[1], z1], P),
        ],
        true,
      ),
    );
  }

  return `<g class="cm-pillbox">${solid(body, { tone: "mid" })}<path class="cm-slit" d="${slits.join("")}"/>${solid(cap, { tone: "mid" })}</g>`;
};

type V3 = [number, number, number];
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross3 = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const RAD = Math.PI / 180;
const VIEW: V3 = [
  Math.cos((P.azimuth ?? 45) * RAD) * Math.cos((P.elevation ?? 30) * RAD),
  Math.sin((P.azimuth ?? 45) * RAD) * Math.cos((P.elevation ?? 30) * RAD),
  Math.sin((P.elevation ?? 30) * RAD),
];
const LIGHT: [number, number] = [
  -Math.sin((P.azimuth ?? 45) * RAD),
  Math.cos((P.azimuth ?? 45) * RAD),
];

const hull2 = (points: Flat[]) => {
  const sorted = [...points].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const turn = (o: Flat, a: Flat, b: Flat) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Flat[] = [];
  for (const p of sorted) {
    while (
      lower.length >= 2 &&
      turn(lower.at(-2) ?? p, lower.at(-1) ?? p, p) <= 0
    )
      lower.pop();
    lower.push(p);
  }
  const upper: Flat[] = [];
  for (const p of [...sorted].reverse()) {
    while (
      upper.length >= 2 &&
      turn(upper.at(-2) ?? p, upper.at(-1) ?? p, p) <= 0
    )
      upper.pop();
    upper.push(p);
  }

  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};

// A gabled roof over a four-cornered plan whose first edge runs along the ridge.
const gable = (
  ring: Plane[],
  z: number,
  rise: number,
  over: number,
  span = 1,
) => {
  const [p0, p1, p2, p3] = ring as [Plane, Plane, Plane, Plane];
  const cx = (p0[0] + p1[0] + p2[0] + p3[0]) / 4;
  const cy = (p0[1] + p1[1] + p2[1] + p3[1]) / 4;
  const grow = (p: Plane): V3 => {
    const dx = p[0] - cx;
    const dy = p[1] - cy;
    const l = Math.hypot(dx, dy) || 1;

    return [p[0] + (dx / l) * over, p[1] + (dy / l) * over, z];
  };
  const e = [grow(p0), grow(p1), grow(p2), grow(p3)];
  const r0: V3 = [
    cx + ((e[0][0] + e[3][0]) / 2 - cx) * span,
    cy + ((e[0][1] + e[3][1]) / 2 - cy) * span,
    z + rise,
  ];
  const r1: V3 = [
    cx + ((e[1][0] + e[2][0]) / 2 - cx) * span,
    cy + ((e[1][1] + e[2][1]) / 2 - cy) * span,
    z + rise,
  ];
  const centre: V3 = [cx, cy, z + rise / 3];
  const faces: V3[][] = [
    [e[0], e[1], r1, r0],
    [e[2], e[3], r0, r1],
    [e[3], e[0], r0],
    [e[1], e[2], r1],
  ];
  const project3 = (p: V3) => k.iso(p, P);
  const parts: string[] = [];
  const all = [...e, r0, r1].map(project3);
  parts.push(`<path class="iso-fill" d="${k.pathOf(hull2(all), true)}"/>`);
  const visible: boolean[] = [];
  for (const face of faces) {
    let n = cross3(sub3(face[1], face[0]), sub3(face[2], face[0]));
    const mid = face.reduce<V3>(
      (s, p) => [
        s[0] + p[0] / face.length,
        s[1] + p[1] / face.length,
        s[2] + p[2] / face.length,
      ],
      [0, 0, 0],
    );
    if (dot3(n, sub3(mid, centre)) < 0) n = [-n[0], -n[1], -n[2]];
    const len = Math.hypot(...n) || 1;
    const u: V3 = [n[0] / len, n[1] / len, n[2] / len];
    const shows = dot3(u, VIEW) > 1e-6;
    visible.push(shows);
    if (!shows) continue;
    const score =
      0.5 +
      0.5 * (u[0] * LIGHT[0] + u[1] * LIGHT[1]) * Math.hypot(u[0], u[1]) +
      0.35 * u[2];
    const shade = Math.min(3, Math.max(0, Math.floor(score * 3.2)));
    parts.push(
      `<path class="iso-shade" data-shade="${shade}" d="${k.pathOf(face.map(project3), true)}"/>`,
    );
  }
  const ridge =
    visible[0] && visible[1] ? k.pathOf([project3(r0), project3(r1)]) : "";
  if (ridge)
    parts.push(
      `<path class="iso-line iso-crease" data-tone="lo" d="${ridge}"/>`,
    );
  parts.push(
    `<path class="iso-line iso-edge" data-tone="mid" d="${k.pathOf(hull2(all), true)}"/>`,
  );

  return `<g class="iso-solid cm-roof">${parts.join("")}</g>`;
};

const building = (ring: Plane[], h: number, floors: number, rise = 0) => {
  const seams = Array.from({ length: floors - 1 }, (_, i) =>
    line(k.ringSeam(ring, Z_LAND + ((i + 1) * h) / floors, P), {
      tone: "faint",
    }),
  ).join("");
  const walls = solid(k.extrude(ring, Z_LAND, h, P), {
    inner: seams,
    tone: "mid",
  });
  if (rise > 0) return `${walls}${gable(ring, Z_LAND + h, rise, 0.3)}`;
  const cx = ring.reduce((s, p) => s + p[0], 0) / ring.length;
  const cy = ring.reduce((s, p) => s + p[1], 0) / ring.length;
  const roofRing = ring.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    const l = Math.hypot(dx, dy) || 1;

    return [x + (dx / l) * 0.3, y + (dy / l) * 0.3] as Plane;
  });

  return `${walls}${solid(k.extrude(roofRing, Z_LAND + h, 0.4, P, { bevel: 0.3 }), { tone: "mid" })}`;
};

const footbridge = (from: Plane, to: Plane) => {
  const [ax, ay] = from;
  const [bx, by] = to;
  const angle = Math.atan2(by - ay, bx - ax);
  const length = Math.hypot(bx - ax, by - ay);
  const centre: Plane = [(ax + bx) / 2, (ay + by) / 2];
  const deck = rotRect(centre, length, 1.1, angle);
  const z = Z_LAND + 0.25;
  const rails = [-0.5, 0.5].map((v) => {
    const ends = [-length / 2 + 0.2, length / 2 - 0.2].map(
      (u) =>
        [
          centre[0] + u * Math.cos(angle) - v * Math.sin(angle),
          centre[1] + u * Math.sin(angle) + v * Math.cos(angle),
        ] as Plane,
    );
    const top = 0.9;

    return [
      k.segment([...ends[0], z + top], [...ends[1], z + top], P),
      ...ends.map((p) => k.rise(p, z, z + top, P)),
    ].join("");
  });

  return `${solid(k.extrude(deck, Z_LAND - 0.1, 0.35, P, { bevel: 0.1 }), { tone: "mid" })}${line(rails.join(""), { tone: "mid" })}`;
};

const trestles = (centre: Plane, angle: number, length: number) => {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const legs = [-0.3, 0.3].flatMap((u) =>
    [-0.35, 0.35].map(
      (v) =>
        [
          centre[0] + u * length * c - v * s,
          centre[1] + u * length * s + v * c,
        ] as Plane,
    ),
  );
  const z = Z_LAND + 0.9;
  const bars = [-0.3, 0.3].map((u) => {
    const a: Plane = [
      centre[0] + u * length * c + 0.45 * s,
      centre[1] + u * length * s - 0.45 * c,
    ];
    const b: Plane = [
      centre[0] + u * length * c - 0.45 * s,
      centre[1] + u * length * s + 0.45 * c,
    ];

    return k.segment([...a, z], [...b, z], P);
  });
  const hull = k.extrude(
    Array.from({ length: 18 }, (_, i) => {
      const t = (i / 18) * Math.PI * 2;
      const u = Math.cos(t) * (length / 2);
      const v = Math.sin(t) * 0.32 * Math.sqrt(Math.abs(Math.sin(t)) + 0.05);

      return [centre[0] + u * c - v * s, centre[1] + u * s + v * c] as Plane;
    }),
    z,
    0.3,
    P,
  );

  return `${line(legs.map((p) => k.rise(p, Z_LAND, z, P)).join("") + bars.join(""), { tone: "mid" })}${solid(hull, { tone: "mid" })}`;
};

const post = ([x, y]: Plane, h: number, r = 0.22, tone: k.Tone = "mid") =>
  solid(k.cylinder(x, y, r, Z_LAND, h, P, 10), { crease: "none", tone });

const finishPost = (p: Plane) => {
  const [x, y] = p;
  const top = Z_LAND + 4.2;
  const board = k.extrude(rotRect([x, y], 1.4, 0.14, 0), top - 1.2, 1.1, P, {
    bevel: 0.1,
  });

  return `${post(p, 4.2, 0.2, "hi")}${solid(board, { tone: "hi" })}`;
};

const lifeBuoy = (p: Plane) => {
  const [x, y] = p;
  const c = k.sideRing([x, y + 0.24, Z_LAND + 1.6], 0.5, "y", P, 18);

  return `${post(p, 2.2, 0.16, "lo")}<path class="iso-line cm-buoy" data-tone="mid" d="${c}"/>`;
};

const trailer = ([x, y]: Plane, angle: number) => {
  const deck = k.extrude(
    rotRect([x, y], 5.2, 1.2, angle),
    Z_LAND + 0.5,
    0.25,
    P,
  );
  const hull = k.extrude(
    rotRect([x, y], 4.6, 0.42, angle),
    Z_LAND + 0.75,
    0.32,
    P,
    { bevel: 0.08 },
  );
  const wheels = [-0.7, 0.7].map((v) => {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    return k.cylinder(x - v * s, y + v * c, 0.3, Z_LAND, 0.5, P, 10);
  });

  return `${wheels.map((wh) => solid(wh, { crease: "none", tone: "lo" })).join("")}${solid(deck, { tone: "lo" })}${solid(hull, { tone: "mid" })}`;
};

const house = ([x, y]: Plane, angle: number, size = 1) => {
  const ring = rotRect([x, y], 3.4 * size, 2.4 * size, angle);

  return building(ring, 1.5 * size, 2, 1.1 * size);
};

const HOUSES: [Plane, number][] = [];
for (let i = 0; i < 7; i++)
  HOUSES.push([w([650 + (i % 2) * 18, -136 + i * 24]), 0]);
for (let i = 0; i < 4; i++) HOUSES.push([w([-100 + i * 15, -138]), 0]);

const LANDSCAPE: Item[] = [];
const add = (p: Plane, svg: string, bias = 0) =>
  LANDSCAPE.push({ key: depth(p) + bias, svg });

for (const [p, size] of TREES) add(p, treeSvg(p, size));
for (const p of PILL_BOXES) add(p, pillBox(p));
for (const [p, angle] of HOUSES) add(p, house(p, angle));

const GRANARY = rotRect(w([-14, -110]), 22 / M, 11 / M, Math.PI / 2 - 0.05);
add(w([-14, -110]), building(GRANARY, 4.2, 3, 2));
const CLUBHOUSE = rotRect(w([-88, -70]), 28 / M, 13 / M, -0.35);
add(w([-88, -70]), building(CLUBHOUSE, 2.8, 2, 1.4));
const THEATRE = rotRect(w([-92, -118]), 20 / M, 13 / M, 0);
add(w([-92, -118]), building(THEATRE, 3.2, 2));

for (let i = 0; i < 4; i++) {
  const p = w([24 + i * 24, -76 - i * 4]);
  add(p, trailer(p, -0.17));
}

const finishLeft = w(offsetAt(0, widthAt(0) / 2 + 2.5));
const finishRight = w(offsetAt(0, -widthAt(0) / 2 - 2.5));
add(finishLeft, finishPost(finishLeft));
add(finishRight, finishPost(finishRight));
for (const at of [350, 650]) {
  for (const side of [1, -1]) {
    const p = w(offsetAt(at, side * (widthAt(at) / 2 + 2.5)));
    add(p, post(p, 3, 0.2, "hi"));
  }
}
for (const [at, side] of [
  [60, -1],
  [210, -1],
  [300, 1],
  [430, -1],
  [560, -1],
] as const) {
  const p = w(offsetAt(at, side * (widthAt(at) / 2 + 4)));
  add(p, lifeBuoy(p));
}

const streamPoint = (stream: Stream, t: number): Plane => {
  const pts = stream.line;
  const i = Math.min(pts.length - 2, Math.floor(t));
  const f = t - i;

  return [
    pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f,
    pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f,
  ];
};
const bridgeOver = (stream: Stream, t: number) => {
  const p = streamPoint(stream, t);
  const q = streamPoint(stream, t + 0.05);
  const h = Math.atan2(q[1] - p[1], q[0] - p[0]);
  const half = (stream.width * EX) / 2 + 3.5;
  const from = w([p[0] + Math.sin(h) * half, p[1] - Math.cos(h) * half]);
  const to = w([p[0] - Math.sin(h) * half, p[1] + Math.cos(h) * half]);
  add(
    [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2],
    footbridge(from, to),
    0.5,
  );
};
bridgeOver(CUT, 0.55);
bridgeOver(MILL, 0.6);
bridgeOver(BACKWATER, 0.4);

// The board, its feet, ruler strip, label plate and compass.
const feet = k.corners(BOARD, 7).sort((a, b) => depth(a) - depth(b));
const feetSvg = feet
  .map(
    ([x, y]) =>
      `${solid(k.cylinder(x, y, 4, Z_BOARD - 4, 1.2, P, 28), { tone: "lo" })}${solid(k.cylinder(x, y, 3, Z_BOARD - 2.8, 2.8, P, 28), { crease: "none", tone: "lo" })}`,
  )
  .join("");
const boardSvg = solid(k.slabOf(BOARD, Z_BOARD, 4, P, 8, 0.9), { tone: "lo" });
const groove = line(k.planOutline(k.insetPlan(BOARD, 2.2), 0, P), {
  tone: "faint",
});
const screws = k.corners(BOARD, 3.4);
const screwSvg = (list: Plane[]) =>
  list
    .map(([x, y]) => line(k.ring(x, y, 0.9, 0, P, 14), { tone: "lo" }))
    .join("") +
  k.dotsSvg(
    list.map((p) => k.iso(at3(p, 0), P)),
    { size: 0.45, tone: "mid" },
  );
const backScrews = screws.filter((p) => p[1] < 0);
const frontScrews = screws.filter((p) => p[1] > 0);

const RULER: Plan = {
  d: 3.2,
  r: 0.5,
  w: 200 / M + 4,
  x: MODEL.x + 8,
  y: MODEL.y + MODEL.d + 6.5,
};
const rulerTicks = k.topTicks(
  RULER.x + 2,
  RULER.x + 2 + 200 / M + 0.01,
  10 / M,
  5,
  RULER.y + 0.1,
  0.5,
  [0.9, 1.7],
  P,
);
const rulerSvg = `${solid(k.slabOf(RULER, 0, 0.5, P, 3), { crease: "none", tone: "lo" })}${line(rulerTicks.minor, { tone: "lo" })}${line(rulerTicks.major, { tone: "mid" })}`;

const LABEL: Plan = {
  d: 7,
  r: 0.8,
  w: 34,
  x: MODEL.x + MODEL.w - 52,
  y: MODEL.y + MODEL.d + 4.5,
};
const labelRules = [26, 19, 22]
  .map((length, i) =>
    line(
      k.lineOnTop(
        [LABEL.x + 3.4, LABEL.y + 2 + i * 1.5],
        [LABEL.x + 3.4 + length, LABEL.y + 2 + i * 1.5],
        0.7,
        P,
      ),
      { free: true, tone: "lo" },
    ),
  )
  .join("");
const labelSvg = `${solid(k.slabOf(LABEL, 0, 0.7, P, 4, 0.3), { tone: "mid" })}${line(k.planOutline(k.insetPlan(LABEL, 1.2), 0.7, P), { tone: "faint" })}${labelRules}${k.dotsSvg(
  [
    k.iso([LABEL.x + 1.9, LABEL.y + LABEL.d / 2, 0.7], P),
    k.iso([LABEL.x + LABEL.w - 1.9, LABEL.y + LABEL.d / 2, 0.7], P),
  ],
  { size: 0.45, tone: "mid" },
)}`;

const COMPASS = {
  r: 4.2,
  x: MODEL.x + MODEL.w - 9,
  y: MODEL.y + MODEL.d + 7.3,
};
const compassTicks = k.radialTicks(
  COMPASS.x,
  COMPASS.y,
  COMPASS.r - 0.6,
  32,
  8,
  0.9,
  [0.6, 1.2],
  P,
);
const needle = k.pathOf(
  [
    k.iso([COMPASS.x - 0.7, COMPASS.y, 1], P),
    k.iso([COMPASS.x, COMPASS.y - COMPASS.r + 1.6, 1], P),
    k.iso([COMPASS.x + 0.7, COMPASS.y, 1], P),
  ],
  true,
);
const tail = k.pathOf(
  [
    k.iso([COMPASS.x - 0.7, COMPASS.y, 1], P),
    k.iso([COMPASS.x, COMPASS.y + COMPASS.r - 1.8, 1], P),
    k.iso([COMPASS.x + 0.7, COMPASS.y, 1], P),
  ],
  true,
);
const compassSvg = `${solid(k.cylinder(COMPASS.x, COMPASS.y, COMPASS.r, 0, 0.9, P, 48, 0.3), { tone: "mid" })}${line(k.ring(COMPASS.x, COMPASS.y, COMPASS.r - 0.6, 0.9, P, 48), { tone: "faint" })}${line(compassTicks.minor, { tone: "lo" })}${line(compassTicks.major, { tone: "mid" })}<path class="cm-needle" d="${needle}"/><path class="iso-fill" d="${tail}"/><path class="iso-line" data-tone="mid" d="${tail}"/>${k.faceTextSvg(k.topMatrix([COMPASS.x - 0.75, COMPASS.y - COMPASS.r - 0.9], 0, P, "x"), "N", { size: 2.2, tone: "mid" })}`;

// The cast land slab, with its inlays.
const modelSlab = k.slabOf(MODEL, 0, Z_LAND, P, 2, 0.6);
const slabSvg = solid(modelSlab, { className: "cm-land", tone: "mid" });

const meadow: Plane[] = smoothLine(
  resample(
    [
      w(offsetAt(-10, 15)),
      w([10, -88]),
      w([180, -110]),
      w([318, -128]),
      w(offsetAt(322, 15)),
    ],
    4,
  ),
  2,
);
const meadowSvg = line(open(meadow, Z_LAND), { tone: "lo" });

// Regatta day on Friar's Meadow, after the aerial photograph: marquees and gazebos along the bank, boat racks by the finish and the car park behind.
const meadowEdgeAt = (x: number) => {
  for (let i = 1; i < meadow.length; i++) {
    const a = meadow[i - 1];
    const b = meadow[i];
    if ((x - a[0]) * (x - b[0]) <= 0 && a[0] !== b[0])
      return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0]);
  }

  return -Infinity;
};
const onMeadow = (p: Plane, margin: number) =>
  p[1] > meadowEdgeAt(p[0]) + margin;
const riverAngle = (at: number) => (pointAt(at).heading * Math.PI) / 180;

const marquee = (
  centre: Plane,
  angle: number,
  length: number,
  depth: number,
) => {
  const ring = rotRect(centre, length, depth, angle);

  return `${solid(k.extrude(ring, Z_LAND, 0.75, P), { tone: "mid" })}${gable(ring, Z_LAND + 0.75, 0.75, 0.12)}`;
};

const gazebo = (centre: Plane, angle: number, size: number) => {
  const ring = rotRect(centre, size, size, angle);
  const z = Z_LAND + 0.8;
  const legs = ring.map((p) => k.rise(p, Z_LAND, z, P)).join("");

  return `${line(legs, { tone: "mid" })}${gable(ring, z, 0.45, 0.08, 0)}`;
};

const car = (centre: Plane, angle: number, tone: k.Tone) => {
  const body = rotRect(centre, 1.45, 0.62, angle);
  const cabin = rotRect(
    [centre[0] - 0.08 * Math.cos(angle), centre[1] - 0.08 * Math.sin(angle)],
    0.78,
    0.54,
    angle,
  );

  return `${solid(k.extrude(body, Z_LAND, 0.32, P, { bevel: 0.05 }), { tone })}${solid(k.extrude(cabin, Z_LAND + 0.32, 0.22, P, { bevel: 0.04 }), { tone })}`;
};

for (const [at, length] of [
  [92, 18],
  [116, 14],
  [138, 12],
] as const) {
  const p = w(offsetAt(at, 30));
  add(p, marquee(p, riverAngle(at), length / M, 9 / M));
}
for (let at = 162; at <= 318; at += 17) {
  const p = w(offsetAt(at, 26 + (at % 2) * 3));
  add(p, gazebo(p, riverAngle(at), 3.6 / M));
}
for (const [row, offset] of [42, 50, 58].entries()) {
  for (let at = 4; at <= 52; at += 9) {
    const p = w(offsetAt(at + row * 3, offset));
    if (onMeadow(p, 1)) add(p, trestles(p, riverAngle(at), (13.4 * EX) / M));
  }
}
{
  const rand = mulberry(41);
  const tones: k.Tone[] = ["mid", "mid", "lo"];
  for (const offset of [44, 51, 61, 68, 78, 85]) {
    for (let at = 168; at <= 330; at += 6.4) {
      const p = w(offsetAt(at, offset));
      if (rand() < 0.16 || !onMeadow(p, 2.2)) continue;
      add(
        p,
        car(
          p,
          riverAngle(at) + Math.PI / 2,
          tones[Math.floor(rand() * tones.length)] ?? "mid",
        ),
      );
    }
  }
}

const trailerPark = line(
  closed(rotRect(w([60, -82]), 100 / M, 20 / M, -0.17), Z_LAND),
  { dashed: true, tone: "lo" },
);

const pitch = rotRect(w([598, -112]), 70 / M, 42 / M, Math.PI / 2 + 0.1);
const sports = rotRect(w([596, -106]), 104 / M, 64 / M, Math.PI / 2 + 0.1);
const mid = (a: Plane, b: Plane): Plane => [
  (a[0] + b[0]) / 2,
  (a[1] + b[1]) / 2,
];
const sportsSvg = `${line(closed(pitch, Z_LAND), { tone: "lo" })}${line(open([mid(pitch[0], pitch[1]), mid(pitch[3], pitch[2])], Z_LAND), { tone: "lo" })}${line(k.ring(...mid(pitch[0], pitch[2]), 2.4, Z_LAND, P, 28), { tone: "lo" })}`;

const road: Plane[] = smoothLine(
  resample(
    [w([640, -150]), w([636, -60]), w([626, 60]), w([618, 120]), w([604, 172])],
    3,
  ),
);
const ROAD_EDGE: Plane[] = road
  .map(([x, y]) => [x + 5.6, y] as Plane)
  .reverse();
const roadSvg = `${line(
  open(
    road.map(([x, y]) => [x + 3.2, y] as Plane),
    Z_LAND,
  ),
  { tone: "lo" },
)}${line(
  open(
    road.map(([x, y]) => [x + 5.6, y] as Plane),
    Z_LAND,
  ),
  { tone: "lo" },
)}`;

const hedgesSvg = hedges
  .map((h) => {
    const pts = smoothLine(resample(h, 3)).map(
      ([x, y]) =>
        [
          Math.min(MODEL.x + MODEL.w, Math.max(MODEL.x, x)),
          Math.min(MODEL.y + MODEL.d, Math.max(MODEL.y, y)),
        ] as Plane,
    );

    return line(open(pts, Z_LAND), { dotted: true, tone: "mid" });
  })
  .join("");

const patch = (ring: Plane[], kind: string) =>
  `<path class="cm-patch" data-kind="${kind}" d="${closed(clipToRect(ring, k.insetPlan(MODEL, 0.25)), Z_LAND)}"/>`;
const meadowRing: Plane[] = [
  ...meadow,
  ...Array.from({ length: 84 }, (_, i) => w(offsetAt(322 - i * 4, 0))),
];
const fieldsSvg = [
  patch(meadowRing, "meadow"),
  patch(
    [
      w([-112, -150]),
      w([20, -150]),
      w([10, -100]),
      ...meadow.slice(0, 6),
      w(offsetAt(-10, 0)),
      w(offsetAt(-112, 0)),
    ],
    "town",
  ),
  patch([w([684, -150]), w([684, 172]), ...ROAD_EDGE], "town"),
  patch(sports, "pitch"),
  patch([...H1, w(offsetAt(82, 0)), w(offsetAt(-112, 0))], "field"),
  patch([...H4, w([-112, 172])], "field"),
  patch(
    [...H2, w(offsetAt(300, 0)), w(offsetAt(450, 0)), ...[...H3].reverse()],
    "field",
  ),
].join("");

const landSvg = `${fieldsSvg}${meadowSvg}${trailerPark}${sportsSvg}${roadSvg}${hedgesSvg}`;

// The channel: walls, water and everything on the water, clipped to the opening.
const opening = WATER_RINGS.map((ring) => closed(ring, Z_LAND)).join("");
const drop = k.screenRise(Z_LAND - Z_WATER, P);
const waterSvg = WATER_RINGS.map((ring) => closed(ring, Z_WATER)).join("");
const waterline = BANK_EDGES.map((e) => open(e, Z_WATER)).join("");
const bankTop = BANK_EDGES.map((e) => open(e, Z_LAND)).join("");

// Where the river leaves the slab through its front face.
const exitNotch = () => {
  const y = MODEL.y + MODEL.d;
  const xs: number[] = [];
  const ring = WATER_RINGS[0];
  for (const p of ring) if (Math.abs(p[1] - y) < 1e-6) xs.push(p[0]);
  if (xs.length < 2) return { clip: "", lines: "" };
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const face = k.pathOf(
    [
      k.iso([x0, y, Z_LAND], P),
      k.iso([x1, y, Z_LAND], P),
      k.iso([x1, y, Z_WATER - 0.4], P),
      k.iso([x0, y, Z_WATER - 0.4], P),
    ],
    true,
  );
  const lines = [
    k.segment([x0, y, Z_LAND], [x0, y, Z_WATER], P),
    k.segment([x1, y, Z_LAND], [x1, y, Z_WATER], P),
    k.segment([x0, y, Z_WATER], [x1, y, Z_WATER], P),
  ].join("");

  return { clip: face, lines };
};
const NOTCH = exitNotch();

const flowLines = [-8, 8].map((by) => {
  const pts: Plane[] = [];
  for (let at = RIVER_FROM; at <= RIVER_TO; at += 4) {
    const p = w(offsetAt(at, by * (widthAt(at) / 24)));
    if (inModel(p)) pts.push(p);
  }

  return open(pts, Z_WATER);
});

const courseLine = (from: number, to: number) => {
  const pts: Plane[] = [];
  for (let at = from; at <= to; at += 4) pts.push(w(offsetAt(at, 0)));

  return open(pts, Z_WATER);
};
const ticks = (from: number, to: number) => {
  const out: Flat[] = [];
  for (let at = from; at <= to; at += 50)
    out.push(k.iso(at3(w(offsetAt(at, 0)), Z_WATER), P));

  return out;
};
const across = (at: number, over = 0) =>
  open(
    [
      w(offsetAt(at, widthAt(at) / 2 + over)),
      w(offsetAt(at, -widthAt(at) / 2 - over)),
    ],
    Z_WATER,
  );

// Stake boats hold the sterns of the 650m crews, so they sit one drawn hull length below the start.
const stakeBoat = (lane: number) => {
  const at = 650 + COURSES["650m"].boat.length * EX + 2;
  const p = pointAt(at);
  const c = w(offsetAt(at, lane * EX));
  const ring = rotRect(
    c,
    (4 * EX) / M,
    (2.4 * EX) / M,
    (p.heading * Math.PI) / 180,
  );

  return solid(k.extrude(ring, Z_WATER - 0.1, 0.45, P, { bevel: 0.12 }), {
    tone: "mid",
  });
};

const jetty = (at: number, side: 1 | -1, length: number) => {
  const p = pointAt(at);
  const c = w(offsetAt(at, side * (widthAt(at) / 2 - 1.4)));
  const ring = rotRect(
    c,
    (length * EX) / M,
    (2.6 * EX) / M,
    (p.heading * Math.PI) / 180,
  );

  return solid(k.extrude(ring, Z_WATER - 0.1, 0.55, P, { bevel: 0.12 }), {
    tone: "mid",
  });
};

const launch = () => {
  const at = BEND_FROM + 40;
  const p = pointAt(at);
  const c = w(offsetAt(at, widthAt(at) / 2 - 4.2 * EX));
  const h = (p.heading * Math.PI) / 180;
  const hull = Array.from({ length: 16 }, (_, i) => {
    const t = (i / 16) * Math.PI * 2;
    const u = (Math.cos(t) * (2.6 * EX)) / M;
    const v =
      ((Math.sin(t) * (1 * EX)) / M) *
      (Math.cos(t) > 0 ? 1 - 0.5 * Math.cos(t) ** 4 : 1);

    return [
      c[0] + u * Math.cos(h) - v * Math.sin(h),
      c[1] + u * Math.sin(h) + v * Math.cos(h),
    ] as Plane;
  });
  const consoleRing = rotRect(
    [c[0] - 0.2 * Math.cos(h), c[1] - 0.2 * Math.sin(h)],
    0.7,
    0.55,
    h,
  );

  return `${solid(k.extrude(hull, Z_WATER - 0.05, 0.45, P, { bevel: 0.12 }), { tone: "mid" })}${solid(k.extrude(consoleRing, Z_WATER + 0.4, 0.45, P, { bevel: 0.06 }), { tone: "mid" })}`;
};

const weir = () => {
  const at = 742;
  const p = pointAt(at);
  const c = w(offsetAt(at, 0));
  const ring = rotRect(
    c,
    2.2 / M,
    (widthAt(at) + 2) / M,
    (p.heading * Math.PI) / 180,
  );
  const lip = rotRect(
    w(offsetAt(at + 2.5, 0)),
    3 / M,
    (widthAt(at) + 2) / M,
    (p.heading * Math.PI) / 180,
  );

  return `${solid(k.extrude(lip, Z_WATER - 0.6, 0.6, P), { crease: "none", tone: "lo" })}${solid(k.extrude(ring, Z_WATER, 0.7, P, { bevel: 0.1 }), { tone: "mid" })}`;
};

const lockGates = () => {
  const out: string[] = [];
  for (const t of [0.15, 0.85]) {
    const a: Plane = [
      CUT.line[2][0] + (CUT.line[3][0] - CUT.line[2][0]) * t,
      CUT.line[2][1] + (CUT.line[3][1] - CUT.line[2][1]) * t,
    ];
    const h = Math.atan2(
      CUT.line[3][1] - CUT.line[2][1],
      CUT.line[3][0] - CUT.line[2][0],
    );
    out.push(
      solid(
        k.extrude(
          rotRect(w(a), 0.5, CUT.width / M, h),
          Z_WATER - 0.2,
          Z_LAND - Z_WATER + 0.5,
          P,
          { bevel: 0.08 },
        ),
        { tone: "mid" },
      ),
    );
  }

  return out.join("");
};

export type ModelArt = {
  under: string;
  water: string;
  fixtures: string;
  over: string;
  clip: string;
};

let model: ModelArt | null = null;

export const modelArt = (): ModelArt => {
  model ??= {
    clip: opening + NOTCH.clip,
    fixtures: [
      jetty(-6, 1, 14),
      jetty(-30, 1, 10),
      jetty(BEND_FROM + 40, 1, 8),
      launch(),
      stakeBoat(5.5),
      stakeBoat(-5.5),
      weir(),
      lockGates(),
    ].join(""),
    over: [
      `<path class="iso-line" data-tone="mid" d="${bankTop}"/>`,
      NOTCH.lines ? line(NOTCH.lines, { tone: "mid" }) : "",
      ...[...LANDSCAPE].sort((a, b) => a.key - b.key).map((item) => item.svg),
      screwSvg(frontScrews),
      rulerSvg,
      labelSvg,
      compassSvg,
    ].join(""),
    under: [
      `<path class="iso-halo" d="${k.haloOf(BOARD, Z_BOARD - 4, 4, P)}"/>`,
      feetSvg,
      boardSvg,
      groove,
      screwSvg(backScrews),
      slabSvg,
      landSvg,
    ].join(""),
    water: [
      `<rect class="cm-wall" x="0" y="0" width="${WIDTH}" height="${HEIGHT}"/>`,
      `<path class="cm-wall-shade" d="${waterSvg}" transform="translate(0 ${(-drop * 0.45).toFixed(2)})"/>`,
      `<path class="cm-water" d="${waterSvg}"/>`,
      `<path class="iso-line" data-tone="faint" d="${waterline}"/>`,
      `<g class="cm-flow">${flowLines.map((d) => `<path class="cm-flow-line" d="${d}"/>`).join("")}</g>`,
    ].join(""),
  };

  return model;
};

export const courseArt = (id: CourseId) => {
  const course = COURSES[id];
  const lines = [
    id === "350m"
      ? line(courseLine(350, 650), { dotted: true, tone: "lo" })
      : "",
    line(courseLine(0, course.length), { tone: "hi" }),
    k.dotsSvg(ticks(50, course.length - 50), { size: 0.7, tone: "hi" }),
    line(across(0), { tone: "hi" }),
    line(across(course.length), { tone: "hi" }),
    line(across(id === "650m" ? 350 : 650), { dotted: true, tone: "lo" }),
  ].join("");
  const points: Flat[] = [];
  for (let at = 0; at <= course.length; at += 5)
    points.push(k.iso(at3(w(offsetAt(at, 0)), Z_WATER), P));

  return { lines, points };
};
