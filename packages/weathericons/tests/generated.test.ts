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

describe("generated lookup", () => {
  it("covers every vendored svg", () => {
    expect([...SYMBOL_CODES]).toEqual(svgFilenames);
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
