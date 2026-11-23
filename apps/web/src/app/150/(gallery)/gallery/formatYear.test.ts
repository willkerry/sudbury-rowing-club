import { describe, expect, it } from "vitest";
import { formatYear } from "@/app/150/(gallery)/gallery/formatYear";

describe("formatYear", () => {
  it("should format the year with a range", () => {
    expect(formatYear("2024", 20)).toBe("c. 2004–2044");
    expect(formatYear("2024", 10)).toBe("c. 2014–2034");
    expect(formatYear("2024", 5)).toBe("c. 2019–2029");
    expect(formatYear("2024", 2)).toBe("c. 2022–2026");
    expect(formatYear("2024", 1)).toBe("c. 2023–2025");
  });

  it("should format the year without a range", () => {
    expect(formatYear("2024", null)).toBe("2024");
  });

  it("should return an empty string if the year is null", () => {
    expect(formatYear(null, 20)).toBe("");
  });
});
