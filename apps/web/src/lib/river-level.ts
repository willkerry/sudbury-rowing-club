import type { Severity } from "@/types/severity";

/** The Environment Agency's daily average flow, in cubic metres per second. */
export type RiverFlow = {
  /** The London day the average covers, as YYYY-MM-DD. */
  date: string;
  value: number;
};

/** The live stage, in whole centimetres, and how far it moved over `hours`. */
export type RiverLevel = {
  change: number;
  hours: number;
  readAt: Date;
};

export type RiverReadings = {
  flow?: RiverFlow;
  level?: RiverLevel;
  station: string;
};

// From Lamarsh's daily flows since 2016: the median day, and roughly the
// fastest sixth and fastest twentieth of days.
export const USUAL_FLOW = 1.35;
export const FAST_FLOW = 3;
export const HIGH_FLOW = 9;

export type FlowBand = "normal" | "fast" | "high";

export const toFlowBand = (value: number): FlowBand => {
  if (value >= HIGH_FLOW) return "high";
  if (value >= FAST_FLOW) return "fast";

  return "normal";
};

const FLOW_DESCRIPTIONS: Record<
  FlowBand,
  { headline: string; status: Severity }
> = {
  fast: { headline: "Faster than usual", status: "amber" },
  high: { headline: "High flow", status: "amber" },
  normal: { headline: "Normal flow", status: "neutral" },
};

export const describeFlow = (value: number) =>
  FLOW_DESCRIPTIONS[toFlowBand(value)];

// Ripples and sensor noise move the stage by a centimetre or so.
const STEADY_CENTIMETRES = 2;

export type LevelTrend = "rising" | "falling" | "steady";

export const toLevelTrend = (change: number): LevelTrend => {
  if (change >= STEADY_CENTIMETRES) return "rising";
  if (change <= -STEADY_CENTIMETRES) return "falling";

  return "steady";
};
