import { coversNow, type ForecastDay } from "./to-forecast-days";

export type SkyPhase = "dawn" | "day" | "dusk" | "night";

type Light = "day" | "night";

/**
 * MET only suffixes a symbol when the sun's position is visible in it. An
 * overcast or steadily raining hour looks the same at noon and midnight, so
 * `cloudy` and `heavyrain` carry no suffix and have to borrow from a neighbour.
 */
const lightOf = (symbol: string): Light | undefined => {
  if (symbol.endsWith("_day")) return "day";
  if (symbol.endsWith("_night")) return "night";

  return;
};

const resolveLights = (symbols: string[]): (Light | undefined)[] => {
  const known = symbols.map(lightOf);

  const distances = known.map((_, offset) => offset + 1);

  return known.map((light, index) => {
    if (light) return light;

    const nearest = distances
      .map((distance) => known[index + distance] ?? known[index - distance])
      .find(Boolean);

    return nearest;
  });
};

/** Hours to look ahead for a change of light before calling it dawn or dusk. */
const TRANSITION_LOOKAHEAD = 2;

export const skyPhaseAt = (symbols: string[], index: number): SkyPhase => {
  const lights = resolveLights(symbols);
  const current = lights[index];

  if (!current) return "day";

  const ahead = lights.slice(index + 1, index + 1 + TRANSITION_LOOKAHEAD);

  if (current === "night" && ahead.includes("day")) return "dawn";
  if (current === "day" && ahead.includes("night")) return "dusk";

  return current;
};

export const currentSkyPhase = (days: ForecastDay[], now: number): SkyPhase => {
  const slots = days.flatMap((day) => day.slots);
  const index = slots.findIndex((slot) => coversNow(slot, now));

  if (index === -1) return "day";

  return skyPhaseAt(
    slots.map((slot) => slot.symbol),
    index,
  );
};
