import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SKY_THEMES } from "@/lib/forecast/sky-theme";
import type { ForecastSlot } from "@/lib/forecast/to-forecast-days";
import {
  ForecastSlotColumn,
  hasWarning,
  rainBarPercent,
} from "./forecast-slot";

afterEach(cleanup);

const MM_PATTERN = /mm/;

const NIGHT_INK = SKY_THEMES.night.ink;

const slot = (overrides: Partial<ForecastSlot> = {}): ForecastSlot => ({
  fog: 0,
  precipitation: 0,
  span: 1,
  symbol: "cloudy",
  temperature: 15,
  time: new Date("2026-08-18T09:00:00Z"),
  wind: { bearing: 315, beaufort: 3, direction: "NW" },
  ...overrides,
});

describe("hasWarning", () => {
  it("is quiet in ordinary conditions", () => {
    expect(hasWarning(slot())).toBe(false);
  });

  it("warns at gale force", () => {
    expect(
      hasWarning(slot({ wind: { bearing: 0, beaufort: 6, direction: "N" } })),
    ).toBe(true);
  });

  it("warns when cold enough to matter", () => {
    expect(hasWarning(slot({ temperature: 3 }))).toBe(true);
    expect(hasWarning(slot({ temperature: 4 }))).toBe(false);
  });

  it("warns when hot enough to matter", () => {
    expect(hasWarning(slot({ temperature: 31 }))).toBe(true);
    expect(hasWarning(slot({ temperature: 30 }))).toBe(false);
  });

  it("warns when temperatureMin is cold even though instant temperature is not", () => {
    expect(hasWarning(slot({ temperature: 15, temperatureMin: 3 }))).toBe(true);
    expect(hasWarning(slot({ temperature: 15, temperatureMin: 4 }))).toBe(
      false,
    );
  });

  it("warns when temperatureMax is hot even though instant temperature is not", () => {
    expect(hasWarning(slot({ temperature: 15, temperatureMax: 31 }))).toBe(
      true,
    );
    expect(hasWarning(slot({ temperature: 15, temperatureMax: 30 }))).toBe(
      false,
    );
  });

  it("warns on significant fog", () => {
    expect(hasWarning(slot({ fog: 40 }))).toBe(true);
    expect(hasWarning(slot({ fog: 39 }))).toBe(false);
  });
});

describe("rainBarPercent", () => {
  it("is zero when dry", () => {
    expect(rainBarPercent(0)).toBe(0);
  });

  it("keeps a trace of rain visible rather than sub-pixel", () => {
    expect(rainBarPercent(0.1)).toBe(15);
  });

  it("scales linearly below the saturation point", () => {
    expect(rainBarPercent(2)).toBe(50);
    expect(rainBarPercent(3)).toBe(75);
  });

  it("saturates at heavy rain instead of dwarfing lighter hours", () => {
    expect(rainBarPercent(4)).toBe(100);
    expect(rainBarPercent(40)).toBe(100);
  });
});

describe("ForecastSlotColumn", () => {
  it("announces precipitation to screen readers either way", () => {
    const { queryByText, rerender } = render(
      <ForecastSlotColumn ink={NIGHT_INK} slot={slot()} />,
    );

    expect(queryByText(MM_PATTERN)).toBeNull();
    expect(queryByText("No rain expected")).not.toBeNull();

    rerender(
      <ForecastSlotColumn
        ink={NIGHT_INK}
        slot={slot({ precipitation: 0.4 })}
      />,
    );

    expect(queryByText("0.4mm of rain")).not.toBeNull();
  });

  it("shows the force as text and names the direction for screen readers", () => {
    const { getByLabelText, getByText } = render(
      <ForecastSlotColumn ink={NIGHT_INK} slot={slot()} />,
    );

    expect(getByText("3")).toBeDefined();
    expect(getByLabelText("NW")).toBeDefined();
  });

  it("points the wind arrow the way the wind is blowing, not where it came from", () => {
    const { getByLabelText } = render(
      <ForecastSlotColumn
        ink={NIGHT_INK}
        slot={slot({ wind: { bearing: 270, beaufort: 4, direction: "W" } })}
      />,
    );

    expect(getByLabelText("W").getAttribute("style")).toContain(
      "rotate(90deg)",
    );
  });
});
