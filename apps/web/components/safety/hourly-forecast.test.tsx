import { describe, expect, it } from "vitest";
import { isWeekend } from "@/lib/forecast/is-weekend";

describe("isWeekend", () => {
  it("returns true for a Saturday in summer (BST)", () => {
    // 2026-08-22 is a Saturday; parsed as UTC midnight, getUTCDay() === 6
    expect(isWeekend("2026-08-22")).toBe(true);
  });

  it("returns true for a Sunday in summer (BST)", () => {
    // 2026-08-23 is a Sunday; getUTCDay() === 0
    expect(isWeekend("2026-08-23")).toBe(true);
  });

  it("returns true for a Saturday in winter (GMT)", () => {
    // 2027-01-02 is a Saturday
    expect(isWeekend("2027-01-02")).toBe(true);
  });

  it("returns false for weekdays", () => {
    expect(isWeekend("2026-08-18")).toBe(false); // Tuesday
    expect(isWeekend("2026-08-19")).toBe(false); // Wednesday
    expect(isWeekend("2026-08-20")).toBe(false); // Thursday
    expect(isWeekend("2026-08-21")).toBe(false); // Friday
  });
});
