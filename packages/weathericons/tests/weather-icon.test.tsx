import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { describeSymbol, WeatherIcon } from "../src/weather-icon";

afterEach(cleanup);

const idsWithin = (container: HTMLElement) =>
  [...container.querySelectorAll("[id]")].map((element) => element.id);

describe("WeatherIcon", () => {
  it("renders an svg for a known symbol", () => {
    const { container } = render(<WeatherIcon symbol="cloudy" />);

    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("gives two different icons no shared element ids", () => {
    const { container } = render(
      <>
        <WeatherIcon symbol="cloudy" />
        <WeatherIcon symbol="partlycloudy_day" />
      </>,
    );

    const ids = idsWithin(container);

    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("exposes the legend description as the accessible name", () => {
    const { getByLabelText } = render(
      <WeatherIcon symbol="partlycloudy_night" />,
    );

    expect(getByLabelText("Partly cloudy")).toBeDefined();
  });

  it("renders nothing for an unknown symbol", () => {
    const { container } = render(
      <WeatherIcon symbol={"notarealsymbol" as never} />,
    );

    expect(container.querySelector("svg")).toBeNull();
  });

  it("strips variant suffixes when describing", () => {
    expect(describeSymbol("clearsky_polartwilight")).toBe("Clear sky");
    expect(describeSymbol("cloudy")).toBe("Cloudy");
  });
});
