import { describe, expect, it } from "vitest";
import { convertBearingToCardinal } from "@/lib/helpers/convertBearingToCardinal";

describe("convertBearingToCardinal", () => {
  it("should convert a bearing to a cardinal direction", () => {
    expect(convertBearingToCardinal(0)).toBe("N");
    expect(convertBearingToCardinal(22.5)).toBe("NNE");
    expect(convertBearingToCardinal(45)).toBe("NE");
    expect(convertBearingToCardinal(67.5)).toBe("ENE");
    expect(convertBearingToCardinal(90)).toBe("E");
    expect(convertBearingToCardinal(112.5)).toBe("ESE");
    expect(convertBearingToCardinal(135)).toBe("SE");
    expect(convertBearingToCardinal(157.5)).toBe("SSE");
    expect(convertBearingToCardinal(180)).toBe("S");
    expect(convertBearingToCardinal(202.5)).toBe("SSW");
    expect(convertBearingToCardinal(225)).toBe("SW");
    expect(convertBearingToCardinal(247.5)).toBe("WSW");
    expect(convertBearingToCardinal(270)).toBe("W");
    expect(convertBearingToCardinal(292.5)).toBe("WNW");
    expect(convertBearingToCardinal(315)).toBe("NW");
    expect(convertBearingToCardinal(337.5)).toBe("NNW");
    expect(convertBearingToCardinal(360)).toBe("N");
  });

  it("should handle bearings outside the range [0, 360)", () => {
    expect(convertBearingToCardinal(-1)).toBe("N");
    expect(convertBearingToCardinal(361)).toBe("N");
    expect(convertBearingToCardinal(360.1)).toBe("N");
    expect(convertBearingToCardinal(360.1)).toBe("N");
  });
});
