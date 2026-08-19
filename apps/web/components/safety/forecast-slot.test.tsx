import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ForecastSlot } from "@/lib/forecast/to-forecast-days";
import { ForecastSlotColumn, hasWarning } from "./forecast-slot";

const MM_PATTERN = /mm/;

const slot = (overrides: Partial<ForecastSlot> = {}): ForecastSlot => ({
  fog: 0,
  precipitation: 0,
  span: 1,
  symbol: "cloudy",
  temperature: 15,
  time: new Date("2026-08-18T09:00:00Z"),
  wind: { beaufort: 3, direction: "NW" },
  ...overrides,
});

describe("hasWarning", () => {
  it("is quiet in ordinary conditions", () => {
    expect(hasWarning(slot())).toBe(false);
  });

  it("warns at gale force", () => {
    expect(hasWarning(slot({ wind: { beaufort: 6, direction: "N" } }))).toBe(
      true,
    );
  });

  it("warns when cold enough to matter", () => {
    expect(hasWarning(slot({ temperature: 3 }))).toBe(true);
    expect(hasWarning(slot({ temperature: 4 }))).toBe(false);
  });

  it("warns when hot enough to matter", () => {
    expect(hasWarning(slot({ temperature: 31 }))).toBe(true);
    expect(hasWarning(slot({ temperature: 30 }))).toBe(false);
  });

  it("warns on significant fog", () => {
    expect(hasWarning(slot({ fog: 40 }))).toBe(true);
    expect(hasWarning(slot({ fog: 39 }))).toBe(false);
  });
});

describe("ForecastSlotColumn", () => {
  it("shows precipitation only when there is some", () => {
    const { queryByText, rerender } = render(
      <ForecastSlotColumn slot={slot()} />,
    );

    expect(queryByText(MM_PATTERN)).toBeNull();

    rerender(<ForecastSlotColumn slot={slot({ precipitation: 0.4 })} />);

    expect(queryByText("0.4mm")).not.toBeNull();
  });

  it("labels the wind with force and direction", () => {
    const { getByText } = render(<ForecastSlotColumn slot={slot()} />);

    expect(getByText("3")).toBeDefined();
    expect(getByText("NW")).toBeDefined();
  });
});
