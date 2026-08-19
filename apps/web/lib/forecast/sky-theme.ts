import type { SkyPhase } from "./sky-phase";

/**
 * Only the daytime sky is light enough to need dark type, so the foreground
 * tokens come in two sets rather than four. Keeping contrast tied to two
 * possibilities rather than four is what makes it checkable.
 */
export type SkyInk = {
  attribution: string;
  border: string;
  hourMuted: string;
  hourNow: string;
  link: string;
  nowBackdrop: string;
  rainBar: string;
  rainTrack: string;
  ring: string;
  skeleton: string;
  tabActive: string;
  tabIdle: string;
  temperature: string;
  toggle: string;
  warning: string;
  wind: string;
  windArrow: string;
};

const DARK_INK: SkyInk = {
  attribution: "text-white/40",
  border: "border-white/10",
  hourMuted: "text-white/45",
  hourNow: "text-white",
  link: "hover:text-white/70",
  nowBackdrop: "bg-white/5",
  rainBar: "bg-sky-400",
  rainTrack: "bg-white/10",
  ring: "focus-visible:ring-white/60",
  skeleton: "bg-white/5",
  tabActive:
    "data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none",
  tabIdle: "text-white/50 hover:text-white/80",
  temperature: "text-white",
  toggle: "text-white/40 hover:bg-white/10 hover:text-white",
  warning: "text-red-400",
  wind: "text-white/80",
  windArrow: "text-white opacity-50",
};

const LIGHT_INK: SkyInk = {
  attribution: "text-sky-950/50",
  border: "border-sky-950/10",
  hourMuted: "text-sky-950/50",
  hourNow: "text-sky-950",
  link: "hover:text-sky-950",
  nowBackdrop: "bg-sky-950/5",
  rainBar: "bg-sky-600",
  rainTrack: "bg-sky-950/10",
  ring: "focus-visible:ring-sky-950/40",
  skeleton: "bg-sky-950/5",
  tabActive:
    "data-[state=active]:bg-white data-[state=active]:text-sky-950 data-[state=active]:shadow-sm",
  tabIdle: "text-sky-950/55 hover:text-sky-950",
  temperature: "text-sky-950",
  toggle: "text-sky-950/50 hover:bg-sky-950/10 hover:text-sky-950",
  warning: "text-red-700",
  wind: "text-sky-950/80",
  windArrow: "text-sky-950 opacity-60",
};

export type SkyTheme = {
  ink: SkyInk;
  ringOffset: string;
  surface: string;
};

/**
 * Daytime runs deeper than a literal pale sky because the MET icons draw their
 * clouds in a light grey that disappears against anything paler.
 */
export const SKY_THEMES: Record<SkyPhase, SkyTheme> = {
  dawn: {
    ink: DARK_INK,
    ringOffset: "ring-offset-indigo-950",
    surface: "bg-linear-to-br from-indigo-950 via-purple-950 to-rose-900",
  },
  day: {
    ink: LIGHT_INK,
    ringOffset: "ring-offset-sky-200",
    surface: "bg-linear-to-br from-sky-300 via-sky-200 to-amber-100",
  },
  dusk: {
    ink: DARK_INK,
    ringOffset: "ring-offset-violet-950",
    surface: "bg-linear-to-br from-slate-950 via-violet-950 to-orange-900",
  },
  night: {
    ink: DARK_INK,
    ringOffset: "ring-offset-blue-950",
    surface: "bg-linear-to-br from-gray-950 to-blue-950",
  },
};
