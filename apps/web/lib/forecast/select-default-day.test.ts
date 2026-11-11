import { describe, expect, it } from "vitest";
import { selectDefaultDayIndex } from "./select-default-day";
import type { ForecastDay } from "./to-forecast-days";

const days: ForecastDay[] = [
  { date: "2026-08-18", slots: [] },
  { date: "2026-08-19", slots: [] },
  { date: "2026-08-20", slots: [] },
];

describe("selectDefaultDayIndex", () => {
  it("picks today before the evening cutoff", () => {
    expect(
      selectDefaultDayIndex(days, new Date("2026-08-18T18:59:00+01:00")),
    ).toBe(0);
  });

  it("picks tomorrow after the evening cutoff", () => {
    expect(
      selectDefaultDayIndex(days, new Date("2026-08-18T20:01:00+01:00")),
    ).toBe(1);
  });

  it("treats the cutoff hour itself as evening", () => {
    expect(
      selectDefaultDayIndex(days, new Date("2026-08-18T20:00:00+01:00")),
    ).toBe(1);
    expect(
      selectDefaultDayIndex(days, new Date("2026-08-18T19:59:00+01:00")),
    ).toBe(0);
  });

  it("evaluates the cutoff in London, not UTC", () => {
    expect(selectDefaultDayIndex(days, new Date("2026-08-18T19:30:00Z"))).toBe(
      1,
    );
  });

  it("does not run past the last day", () => {
    expect(
      selectDefaultDayIndex(days, new Date("2026-08-20T22:00:00+01:00")),
    ).toBe(2);
  });

  it("falls back to the first day when today is absent", () => {
    expect(
      selectDefaultDayIndex(days, new Date("2026-09-01T09:00:00+01:00")),
    ).toBe(0);
  });
});
