import { describe, expect, it } from "vitest";
import { describeFlow, toFlowBand, toLevelTrend } from "./river-level";

describe("toFlowBand", () => {
  it("bands flow at 3 and 9 cubic metres per second", () => {
    expect(toFlowBand(1.1)).toBe("normal");
    expect(toFlowBand(2.99)).toBe("normal");
    expect(toFlowBand(3)).toBe("fast");
    expect(toFlowBand(8.99)).toBe("fast");
    expect(toFlowBand(9)).toBe("high");
  });
});

describe("describeFlow", () => {
  it("keeps normal flow neutral and flags anything faster", () => {
    expect(describeFlow(1.1)).toEqual({
      headline: "Normal flow",
      status: "neutral",
    });
    expect(describeFlow(5)).toEqual({
      headline: "Faster than usual",
      status: "amber",
    });
    expect(describeFlow(24)).toEqual({
      headline: "High flow",
      status: "amber",
    });
  });
});

describe("toLevelTrend", () => {
  it("ignores movements smaller than 2 cm", () => {
    expect(toLevelTrend(1)).toBe("steady");
    expect(toLevelTrend(-1)).toBe("steady");
    expect(toLevelTrend(2)).toBe("rising");
    expect(toLevelTrend(-2)).toBe("falling");
  });
});
