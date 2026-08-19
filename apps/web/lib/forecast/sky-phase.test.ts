import { describe, expect, it } from "vitest";
import { currentSkyPhase, skyPhaseAt } from "./sky-phase";
import type { ForecastDay, ForecastSlot } from "./to-forecast-days";

const slot = (time: string, symbol: string): ForecastSlot => ({
  fog: 0,
  precipitation: 0,
  span: 1,
  symbol: symbol as ForecastSlot["symbol"],
  temperature: 15,
  time: new Date(time),
  wind: { bearing: 0, beaufort: 2, direction: "N" },
});

describe("skyPhaseAt", () => {
  it("reads day and night straight off the symbol suffix", () => {
    const symbols = [
      "clearsky_night",
      "clearsky_night",
      "clearsky_night",
      "fair_day",
    ];

    expect(skyPhaseAt(symbols, 0)).toBe("night");
    expect(skyPhaseAt(symbols, 3)).toBe("day");
  });

  it("calls it dawn only once daybreak is within the lookahead", () => {
    const symbols = [
      "clearsky_night",
      "clearsky_night",
      "clearsky_night",
      "fair_day",
    ];

    expect(skyPhaseAt(symbols, 0)).toBe("night");
    expect(skyPhaseAt(symbols, 1)).toBe("dawn");
  });

  it("calls it dusk while day is about to become night", () => {
    const symbols = [
      "fair_day",
      "fair_day",
      "clearsky_night",
      "clearsky_night",
    ];

    expect(skyPhaseAt(symbols, 1)).toBe("dusk");
  });

  it("borrows from a neighbour when the symbol carries no suffix", () => {
    const symbols = ["clearsky_night", "cloudy", "heavyrain", "clearsky_night"];

    expect(skyPhaseAt(symbols, 1)).toBe("night");
    expect(skyPhaseAt(symbols, 2)).toBe("night");
  });

  it("still finds dawn across an unsuffixed stretch", () => {
    const symbols = ["clearsky_night", "cloudy", "fair_day", "fair_day"];

    expect(skyPhaseAt(symbols, 0)).toBe("dawn");
  });

  it("falls back to day when nothing in the run carries a suffix", () => {
    expect(skyPhaseAt(["cloudy", "rain", "fog"], 1)).toBe("day");
  });
});

describe("currentSkyPhase", () => {
  const days: ForecastDay[] = [
    {
      date: "2026-08-19",
      slots: [
        slot("2026-08-19T20:00:00Z", "fair_day"),
        slot("2026-08-19T21:00:00Z", "clearsky_night"),
        slot("2026-08-19T22:00:00Z", "clearsky_night"),
      ],
    },
  ];

  it("uses the slot covering the current instant", () => {
    const duskHour = new Date("2026-08-19T20:30:00Z").getTime();

    expect(currentSkyPhase(days, duskHour)).toBe("dusk");
  });

  it("moves on as the hours do", () => {
    const nightHour = new Date("2026-08-19T22:30:00Z").getTime();

    expect(currentSkyPhase(days, nightHour)).toBe("night");
  });

  it("defaults to day when the forecast does not reach the current instant", () => {
    const stale = new Date("2020-01-01T00:00:00Z").getTime();

    expect(currentSkyPhase(days, stale)).toBe("day");
  });
});
