import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { ForecastSlot } from "@/lib/forecast/to-forecast-days";
import { ForecastSlotColumn, getWarnings } from "./forecast-slot";

afterEach(cleanup);

const slot = (overrides: Partial<ForecastSlot> = {}): ForecastSlot => ({
  fog: 0,
  span: 1,
  symbol: "cloudy",
  temperature: 15,
  time: new Date("2026-08-18T09:00:00Z"),
  wind: { bearing: 315, beaufort: 3, direction: "NW" },
  ...overrides,
});

describe("getWarnings", () => {
  it("is quiet in ordinary conditions", () => {
    expect(getWarnings(slot())).toEqual([]);
  });

  it("warns at gale force", () => {
    expect(
      getWarnings(slot({ wind: { bearing: 0, beaufort: 6, direction: "N" } })),
    ).toEqual(["high wind"]);
  });

  it("warns when cold enough to matter", () => {
    expect(getWarnings(slot({ temperature: 3 }))).toEqual(["low temperature"]);
    expect(getWarnings(slot({ temperature: 4 }))).toEqual([]);
  });

  it("warns when hot enough to matter", () => {
    expect(getWarnings(slot({ temperature: 31 }))).toEqual([
      "high temperature",
    ]);
    expect(getWarnings(slot({ temperature: 30 }))).toEqual([]);
  });

  it("warns when temperatureMin is cold even though instant temperature is not", () => {
    expect(getWarnings(slot({ temperature: 15, temperatureMin: 3 }))).toEqual([
      "low temperature",
    ]);
    expect(getWarnings(slot({ temperature: 15, temperatureMin: 4 }))).toEqual(
      [],
    );
  });

  it("warns when temperatureMax is hot even though instant temperature is not", () => {
    expect(getWarnings(slot({ temperature: 15, temperatureMax: 31 }))).toEqual([
      "high temperature",
    ]);
    expect(getWarnings(slot({ temperature: 15, temperatureMax: 30 }))).toEqual(
      [],
    );
  });

  it("warns on significant fog", () => {
    expect(getWarnings(slot({ fog: 40 }))).toEqual(["fog"]);
    expect(getWarnings(slot({ fog: 39 }))).toEqual([]);
  });

  it("collects every reason a slot is unsafe", () => {
    expect(
      getWarnings(
        slot({
          fog: 80,
          temperature: 2,
          wind: { bearing: 0, beaufort: 7, direction: "N" },
        }),
      ),
    ).toEqual(["high wind", "low temperature", "fog"]);
  });
});

describe("ForecastSlotColumn", () => {
  it("labels the hour in London time rather than the browser's zone", () => {
    const { getByText } = render(<ForecastSlotColumn slot={slot()} />);

    expect(getByText("10")).toBeDefined();
  });

  it("marks the force as a Beaufort number rather than a bare figure", () => {
    const { container } = render(<ForecastSlotColumn slot={slot()} />);

    expect(container.textContent).toContain("F3");
  });

  it("announces the force and the direction the wind comes from as one label", () => {
    const { getByLabelText } = render(<ForecastSlotColumn slot={slot()} />);

    expect(getByLabelText("Force 3, wind from NW")).toBeDefined();
  });

  it("points the wind arrow the way the wind is blowing, not where it came from", () => {
    const { getByLabelText } = render(
      <ForecastSlotColumn
        slot={slot({ wind: { bearing: 270, beaufort: 4, direction: "W" } })}
      />,
    );

    expect(
      getByLabelText("Force 4, wind from W").getAttribute("style"),
    ).toContain("rotate(90deg)");
  });

  it("offers no controls when there is nothing to warn about", () => {
    const { queryByRole } = render(<ForecastSlotColumn slot={slot()} />);

    expect(queryByRole("button")).toBeNull();
  });

  it("offers a named control when the slot carries a warning", () => {
    const { getByRole } = render(
      <ForecastSlotColumn slot={slot({ temperature: 2 })} />,
    );

    expect(
      getByRole("button", { name: "Weather warning at 10" }),
    ).toBeDefined();
  });
});
