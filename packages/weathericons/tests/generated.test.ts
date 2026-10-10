// @vitest-environment node
import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  iconsBySymbol,
  SYMBOL_CODES,
  symbolDescriptions,
} from "../src/generated/lookup";

const svgFilenames = readdirSync(
  new URL("../vendor/weather/svg", import.meta.url),
)
  .filter((file) => file.endsWith(".svg"))
  .map((file) => file.slice(0, -4))
  .sort();

const isPolarTwilight = (code: string) => code.endsWith("_polartwilight");

describe("generated lookup", () => {
  it("covers every vendored svg that can occur at this latitude", () => {
    expect([...SYMBOL_CODES]).toEqual(
      svgFilenames.filter((code) => !isPolarTwilight(code)),
    );
  });

  it("leaves out the polar twilight variants, which cannot occur at 52°N", () => {
    expect(svgFilenames.some(isPolarTwilight)).toBe(true);
    expect([...SYMBOL_CODES].some(isPolarTwilight)).toBe(false);
  });

  it("maps every symbol code to a component", () => {
    for (const code of SYMBOL_CODES) {
      expect(typeof iconsBySymbol[code]).toBe("function");
    }
  });

  it("reads descriptions from the legend", () => {
    expect(symbolDescriptions.partlycloudy).toBe("Partly cloudy");
    expect(symbolDescriptions.clearsky).toBe("Clear sky");
  });
});
