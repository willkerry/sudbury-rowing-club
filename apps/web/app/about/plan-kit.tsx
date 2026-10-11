"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Point = [x: number, y: number];

/** A corner point and how far to round it off. Zero keeps it sharp. */
export type Vertex = [x: number, y: number, radius: number];

export type Line = [from: Point, to: Point];

export const roundedPath = (vertices: Vertex[], closed = true) => {
  const at = (i: number) => vertices[(i + vertices.length) % vertices.length];

  const segments = vertices.map(([x, y, radius], i) => {
    const isEnd = !closed && (i === 0 || i === vertices.length - 1);

    if (radius === 0 || isEnd) return `L${x},${y}`;

    const [px, py] = at(i - 1);
    const [nx, ny] = at(i + 1);
    const toPrevious = Math.hypot(px - x, py - y);
    const toNext = Math.hypot(nx - x, ny - y);
    const r = Math.min(radius, toPrevious / 2, toNext / 2);

    const start = [
      x + ((px - x) / toPrevious) * r,
      y + ((py - y) / toPrevious) * r,
    ];
    const end = [x + ((nx - x) / toNext) * r, y + ((ny - y) / toNext) * r];

    return `L${start[0].toFixed(1)},${start[1].toFixed(1)} Q${x},${y} ${end[0].toFixed(1)},${end[1].toFixed(1)}`;
  });

  return compactPath(`M${segments.join(" ").slice(1)}${closed ? " Z" : ""}`);
};

/** A coordinate to one decimal place, as briefly as SVG allows: `0.5` is `.5`, `2.0` is `2`. */
const LEADING_ZERO = /^(-?)0\./;

export const brief = (n: number) =>
  (Math.round(n * 10) / 10).toString().replace(LEADING_ZERO, "$1.");

const PATH_TOKENS = /[MLHVQCZ]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi;
const COMMAND = /^[A-Z]$/i;

const ARGUMENTS: Record<string, number> = {
  C: 6,
  H: 1,
  L: 2,
  M: 2,
  Q: 4,
  V: 1,
  Z: 0,
};

const tenth = (n: number) => Math.round(n * 10) / 10;

/** A command with its points in absolute coordinates, rounded to a tenth of a unit. */
type Segment = { command: "M" | "L" | "Q" | "C" | "Z"; points: number[] };

/** A command’s arguments as absolute points, with horizontal and vertical lines made plain. */
const absolutePoints = (
  upper: string,
  args: number[],
  origin: number[],
  pen: number[],
) => {
  if (upper === "H") return [args[0] + origin[0], pen[1]];
  if (upper === "V") return [pen[0], args[0] + origin[1]];

  return args.map((n, k) => n + origin[k % 2]);
};

/** Reads path data into absolute segments. */
const parsePath = (d: string) => {
  const tokens = d.match(PATH_TOKENS) ?? [];
  const segments: Segment[] = [];
  let pen = [0, 0];
  let start = [0, 0];
  let command = "M";

  for (let i = 0; i < tokens.length; ) {
    if (COMMAND.test(tokens[i])) command = tokens[i++];

    const upper = command.toUpperCase();
    const args = tokens.slice(i, i + ARGUMENTS[upper]).map(Number);
    i += ARGUMENTS[upper];

    if (upper === "Z") {
      segments.push({ command: "Z", points: [] });
      pen = start;
      continue;
    }

    const origin = command === upper ? [0, 0] : pen;
    const points = absolutePoints(upper, args, origin, pen).map(tenth);

    segments.push({
      command: "HV".includes(upper) ? "L" : (upper as Segment["command"]),
      points,
    });
    pen = points.slice(-2);
    if (upper === "M") {
      start = pen;
      command = command === "m" ? "l" : "L";
    }
  }

  return segments;
};

/** Numbers for path data, spaced only where they’d otherwise run together. */
const joinNumbers = (values: string[], leadingSpace: boolean) =>
  values
    .map((n, k) =>
      (k > 0 || leadingSpace) && !n.startsWith("-") ? ` ${n}` : n,
    )
    .join("");

/**
 * Rewrites path data as compactly as it allows, as SVGO would: relative
 * commands, numbers rounded to a tenth of a unit and stripped of leading
 * zeros, and no command letter repeated where the last one carries on.
 */
export const compactPath = (d: string) => {
  let pen = [0, 0];
  let start = [0, 0];
  let last = "";
  let out = "";

  for (const { command, points } of parsePath(d)) {
    // The first move stays absolute, so paths can be joined end to end.
    const letter = out ? command.toLowerCase() : command;
    const repeats = letter === last && letter !== "z";

    out +=
      (repeats ? "" : letter) +
      joinNumbers(
        points.map((n, k) => brief(n - pen[k % 2])),
        repeats,
      );
    last = letter === "m" ? "l" : letter;
    pen = command === "Z" ? start : points.slice(-2);
    if (command === "M") start = pen;
  }

  return out;
};

/** Straight lines through the points, as compact path data. */
export const polylinePath = (points: Point[], closed = false) =>
  compactPath(
    `M${points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L")}${closed ? " Z" : ""}`,
  );

/** A smooth closed curve through the points: a Catmull–Rom spline drawn as cubic Béziers. */
export const smoothClosedPath = (points: Point[]) =>
  compactPath(
    `${points
      .map((point, i) => {
        const at = (offset: number) =>
          points[(i + offset + points.length) % points.length];
        const [p0, p2, p3] = [at(-1), at(1), at(2)];
        const c1 = [
          point[0] + (p2[0] - p0[0]) / 6,
          point[1] + (p2[1] - p0[1]) / 6,
        ];
        const c2 = [
          p2[0] - (p3[0] - point[0]) / 6,
          p2[1] - (p3[1] - point[1]) / 6,
        ];
        const start =
          i === 0 ? `M${point[0].toFixed(1)},${point[1].toFixed(1)} ` : "";

        return `${start}C${c1.map((n) => n.toFixed(1)).join(",")} ${c2.map((n) => n.toFixed(1)).join(",")} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      })
      .join(" ")} Z`,
  );

export const isInside = ([x, y]: Point, polygon: Point[]) => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
};

/** The direction of a line on the plan, in degrees clockwise from east. */
export const lineAngle = ([[x1, y1], [x2, y2]]: Line) =>
  (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

/**
 * The angle of a line on the plan, in degrees clockwise, turned so text along
 * it reads upright. Near-vertical lines read bottom to top, as on most maps.
 */
export const readableAngle = (line: Line) => {
  const upright = ((lineAngle(line) + 270) % 180) - 90;

  return upright > 85 ? upright - 180 : upright;
};

export const pointAlong = ([[x1, y1], [x2, y2]]: Line, t: number): Point => [
  x1 + (x2 - x1) * t,
  y1 + (y2 - y1) * t,
];

/** A drawn arrowhead with its tip at the origin, pointing along +x. */
export const ARROWHEAD = "M-26,-9 Q-12,-2 0,0 Q-12,2 -26,9";

/** Matches the labels’ tracking, which trails the last letter and would pull them off centre. */
const LABEL_TRACKING_EM = 0.14;

/** The smallest a label may render on screen, in CSS pixels, however narrow the plan. */
const MIN_LABEL_PX = 9;

export const HALO = {
  paintOrder: "stroke",
  stroke: "white",
  strokeLinejoin: "round",
  strokeWidth: 6,
} as const;

export type Label = (
  | {
      /** The label’s centre, in plan coordinates, or its end when anchored. */
      at: Point;
      /** Degrees clockwise, running along the region’s length. */
      angle: number;
      /** Sets the label beside a feature too small to hold it, starting or ending at `at`. */
      anchor?: "start" | "end";
    }
  | {
      /** A line for the label to follow, centred along its length. */
      path: string;
    }
) & {
  size: number;
  /** A class colouring the halo to match what the label sits on. White by default. */
  halo?: string;
  /** Shown all the time, dimming with the rest of the plan while another feature is highlighted. */
  permanent?: boolean;
};

export type Feature = {
  id: string;
  name: string;
  description: string;
  /** Shown on the plan while the feature is highlighted, centred on what’s in view of it. */
  label: Label;
  /** An invisible shape, larger than the drawing where it’s thin, to catch the pointer. */
  hit: ReactNode;
  drawing: ReactNode;
  /** Drawn beneath the drawing, and only while the feature is highlighted. */
  highlight?: ReactNode;
};

export type Tree = { r: number; x: number; y: number };

const CROWN_POINTS = 56;

/**
 * An irregular, crinkled canopy outline, built from a few overlapping waves so it
 * renders identically on the server and in the browser. Each seed turns the
 * crown and shifts its waves, so no two trees in a wood match.
 */
export const treeCrown = ({ r, x, y }: Tree, seed = 0) => {
  const turn = seed * 2.4;

  return smoothClosedPath(
    Array.from({ length: CROWN_POINTS }, (_, i): Point => {
      const angle = (i / CROWN_POINTS) * Math.PI * 2;
      const wobble =
        1 +
        0.1 * Math.sin(3 * angle + 0.6 + seed * 1.3) +
        0.07 * Math.sin(5 * angle + 2.1 + seed * 2.9) +
        0.05 * Math.sin(9 * angle + 0.3 + seed * 0.7) +
        0.04 * Math.sin(14 * angle + 1.7 + seed * 3.7) +
        0.03 * Math.sin(23 * angle + 0.9 + seed * 1.9);
      const [dx, dy] = [
        r * 1.12 * wobble * Math.cos(angle),
        r * 0.92 * wobble * Math.sin(angle),
      ];

      return [
        x + dx * Math.cos(turn) - dy * Math.sin(turn),
        y + dx * Math.sin(turn) + dy * Math.cos(turn),
      ];
    }),
  );
};

/** A repeatable number from 0 to 1 for each integer, the same on the server and in the browser. */
const random = (n: number) => {
  let t = (n * 0x9e3779b9 + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Trees of about `r` scattered through an area, roughly `spacing` apart, so
 * their crowns overlap into woodland. None stands in any of the `clear` areas.
 */
export const scatterTrees = (
  area: Point[],
  { clear = [], r, spacing }: { clear?: Point[][]; r: number; spacing: number },
): Tree[] => {
  const xs = area.map(([x]) => x);
  const ys = area.map(([, y]) => y);
  const rowHeight = spacing * 0.866;
  const trees: Tree[] = [];
  let n = 0;

  for (let y = Math.min(...ys), row = 0; y <= Math.max(...ys); y += rowHeight) {
    for (
      let x = Math.min(...xs) + (row % 2) * (spacing / 2);
      x <= Math.max(...xs);
      x += spacing
    ) {
      n++;
      const tree: Tree = {
        r: r * (0.8 + 0.4 * random(n * 3)),
        x: x + (random(n * 3 + 1) - 0.5) * spacing * 0.7,
        y: y + (random(n * 3 + 2) - 0.5) * rowHeight * 0.7,
      };
      const centre: Point = [tree.x, tree.y];

      if (
        isInside(centre, area) &&
        !clear.some((zone) => isInside(centre, zone))
      ) {
        trees.push(tree);
      }
    }
    row++;
  }

  return trees;
};

export const thickHit = (d: string, width = 36) => (
  <path d={d} stroke="transparent" strokeLinecap="round" strokeWidth={width} />
);

export const fillHit = (d: string) => (
  <path d={d} fill="transparent" stroke="none" />
);

/** Context drawn around the features, faded back while one is highlighted. */
export const Dimmed = ({
  children,
  dim,
}: {
  children: ReactNode;
  dim: boolean;
}) => (
  <g
    className={cn(
      "pointer-events-none transition-opacity duration-200 ease-out-strong",
      { "opacity-30": dim },
    )}
  >
    {children}
  </g>
);

/**
 * Every description shares one grid cell, so the panel below the plan is as
 * tall as the longest and nothing shifts when the content changes.
 */
const PANEL_CELL = "col-start-1 row-start-1 transition-opacity ease-out-strong";
const PANEL_CELL_IN = "opacity-100 delay-75 duration-200";
const PANEL_CELL_OUT = "opacity-0 duration-100";

type ViewBox = { x: number; y: number; width: number; height: number };

/**
 * An interactive plan: each feature can be highlighted from the plan itself or
 * from the legend beneath it, which dims everything else and shows its label
 * and description.
 */
export const Plan = ({
  ariaLabel,
  className,
  features,
  legend,
  overlay,
  panelPosition = "md:top-3 md:right-3",
  underlay,
  viewBox,
}: {
  ariaLabel: string;
  className?: string;
  features: Feature[];
  /** The features’ ids, in the order a reader would look for them. */
  legend: string[];
  /** Drawn above the features and beneath their labels. */
  overlay?: (activeId: string | null) => ReactNode;
  /** Where the description panel sits over the plan on wider screens, clear of the features. */
  panelPosition?: string;
  /** Drawn beneath the features. */
  underlay?: (activeId: string | null) => ReactNode;
  viewBox: ViewBox;
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const descriptionId = useId();

  const [shownId, setShownId] = useState<string | null>(null);

  if (activeId && activeId !== shownId) setShownId(activeId);

  useEffect(() => {
    const svg = svgRef.current;

    if (!svg) return;

    const observer = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / viewBox.width),
    );
    observer.observe(svg);

    return () => observer.disconnect();
  }, [viewBox.width]);

  useEffect(() => {
    const clearOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-plan-feature]")
      ) {
        return;
      }
      setActiveId(null);
    };

    document.addEventListener("pointerdown", clearOutside);

    return () => document.removeEventListener("pointerdown", clearOutside);
  }, []);

  const clear = (id: string) =>
    setActiveId((current) => (current === id ? null : current));

  /** Shared by the regions on the plan and the legend’s buttons. */
  const triggerProps = (id: string) => ({
    "aria-describedby": `${descriptionId}-${id}`,
    "data-plan-feature": "",
    onBlur: () => clear(id),
    onClick: () => setActiveId(id),
    onFocus: () => setActiveId(id),
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") setActiveId(id);
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (event.pointerType === "mouse") clear(id);
    },
  });

  const legendFeatures = legend
    .map((id) => features.find((feature) => feature.id === id))
    .filter((feature): feature is Feature => !!feature);

  return (
    <figure
      className={className}
      onKeyDown={(event) => {
        if (event.key === "Escape") setActiveId(null);
      }}
    >
      <div className="relative">
        <div className="overflow-x-auto rounded-sm border border-current/50">
          <svg
            aria-label={ariaLabel}
            className="block w-full min-w-140 select-none"
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" stroke="currentColor" strokeLinejoin="round">
              {underlay?.(activeId)}

              {features.map(({ drawing, highlight, hit, id, name }) => (
                // biome-ignore lint/a11y/useSemanticElements: an SVG group can’t be a <button>
                <g
                  aria-label={name}
                  className={cn(
                    "cursor-pointer outline-none transition-opacity duration-200 ease-out-strong",
                    { "opacity-30": activeId && activeId !== id },
                  )}
                  key={id}
                  role="button"
                  tabIndex={0}
                  {...triggerProps(id)}
                >
                  {highlight && (
                    <g
                      className={cn(
                        "transition-opacity duration-200 ease-out-strong motion-reduce:transition-none",
                        activeId === id ? "opacity-100" : "opacity-0",
                      )}
                    >
                      {highlight}
                    </g>
                  )}
                  {drawing}
                  {hit}
                </g>
              ))}

              {overlay?.(activeId)}

              <g aria-hidden className="pointer-events-none">
                {features.map(({ id, label, name }) => {
                  const fontSize = Math.max(label.size, MIN_LABEL_PX / scale);
                  const anchor =
                    ("anchor" in label && label.anchor) || "middle";
                  const tracking = fontSize * LABEL_TRACKING_EM;
                  const pathId = `${descriptionId}-${id}-label`.replaceAll(
                    /[^\w-]/g,
                    "",
                  );

                  return (
                    <g key={id}>
                      {"path" in label && (
                        <path d={label.path} id={pathId} stroke="none" />
                      )}
                      <text
                        className={cn(
                          "font-archivo font-bold font-stretch-expanded uppercase tracking-[0.14em] transition-opacity duration-200 ease-out-strong motion-reduce:transition-none",
                          activeId === id || (label.permanent && !activeId)
                            ? "opacity-100"
                            : label.permanent
                              ? "opacity-30"
                              : "opacity-0",
                          label.halo,
                        )}
                        dominantBaseline="central"
                        dx={
                          { end: tracking, middle: tracking / 2, start: 0 }[
                            anchor
                          ]
                        }
                        fill="currentColor"
                        fontSize={fontSize.toFixed(1)}
                        textAnchor={anchor}
                        transform={
                          "at" in label
                            ? `translate(${label.at[0].toFixed(1)} ${label.at[1].toFixed(1)}) rotate(${label.angle.toFixed(1)})`
                            : undefined
                        }
                        {...HALO}
                      >
                        {"path" in label ? (
                          <textPath
                            href={`#${pathId}`}
                            startOffset="50%"
                            textAnchor="middle"
                          >
                            {name}
                          </textPath>
                        ) : (
                          name
                        )}
                      </text>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none mt-3 grid text-pretty text-sm transition-opacity duration-200 ease-out-strong motion-reduce:transition-none md:absolute md:mt-0 md:w-48 md:rounded-sm md:border md:border-blue-950/15 md:bg-white md:px-3 md:py-2 md:shadow-sm lg:w-60",
            panelPosition,
            { "md:opacity-0": !activeId },
          )}
        >
          <p
            className={cn(
              PANEL_CELL,
              "text-gray-500 md:hidden",
              activeId ? PANEL_CELL_OUT : PANEL_CELL_IN,
            )}
          >
            Hover over or tap part of the plan for details.
          </p>
          {features.map(({ description, id, name }) => (
            <p
              className={cn(
                PANEL_CELL,
                "text-gray-700",
                activeId === id ? PANEL_CELL_IN : PANEL_CELL_OUT,
                shownId === id ? "md:opacity-100" : "md:hidden",
              )}
              key={id}
            >
              <span className="font-semibold text-blue-950 md:hidden">
                {name}.{" "}
              </span>
              {description}
            </p>
          ))}
        </div>
      </div>

      <div hidden>
        {features.map(({ description, id }) => (
          <span id={`${descriptionId}-${id}`} key={id}>
            {description}
          </span>
        ))}
      </div>

      <figcaption>
        <ul className="mt-4 flex flex-wrap gap-2">
          {legendFeatures.map(({ id, name }) => (
            <li key={id}>
              <button
                aria-pressed={activeId === id}
                className={cn(
                  "rounded-sm border px-2 py-1 font-medium text-sm transition-colors duration-150",
                  activeId === id
                    ? "border-blue-950 bg-blue-950 text-white"
                    : "border-blue-950/20 bg-white text-blue-950 hover:border-blue-950/50",
                )}
                type="button"
                {...triggerProps(id)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
};
