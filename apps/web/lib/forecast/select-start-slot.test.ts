import { describe, expect, it } from "vitest";
import { selectStartSlotIndex } from "./select-start-slot";
import type { ForecastSlot } from "./to-forecast-days";

const slot = (time: string, span: 1 | 6 = 1): ForecastSlot => ({
  fog: 0,
  span,
  symbol: "cloudy",
  temperature: 15,
  time: new Date(time),
  wind: { bearing: 315, beaufort: 3, direction: "NW" },
});

const hourlyDay = (date: string): ForecastSlot[] =>
  Array.from({ length: 24 }, (_, hour) =>
    slot(`${date}T${String(hour).padStart(2, "0")}:00:00Z`),
  );

describe("selectStartSlotIndex", () => {
  it("opens an hourly day at 07:00 London", () => {
    // January, so London is GMT and the UTC hour is the London hour.
    expect(selectStartSlotIndex(hourlyDay("2027-01-14"))).toBe(7);
  });

  it("opens an hourly day at 07:00 London through British Summer Time", () => {
    // August, so 07:00 London is 06:00Z.
    expect(selectStartSlotIndex(hourlyDay("2026-08-19"))).toBe(6);
  });

  it("opens a six-hourly day at the block covering the morning, not midnight", () => {
    const coarse = [
      slot("2027-01-20T00:00:00Z", 6),
      slot("2027-01-20T06:00:00Z", 6),
      slot("2027-01-20T12:00:00Z", 6),
      slot("2027-01-20T18:00:00Z", 6),
    ];

    expect(selectStartSlotIndex(coarse)).toBe(1);
  });

  it("opens a six-hourly summer day at the block covering the morning", () => {
    // In BST these render as 01, 07, 13 and 19 London.
    const coarse = [
      slot("2026-08-22T00:00:00Z", 6),
      slot("2026-08-22T06:00:00Z", 6),
      slot("2026-08-22T12:00:00Z", 6),
      slot("2026-08-22T18:00:00Z", 6),
    ];

    expect(selectStartSlotIndex(coarse)).toBe(1);
  });

  it("opens today at its first remaining slot when the morning has passed", () => {
    const remainder = [
      slot("2027-01-14T14:00:00Z"),
      slot("2027-01-14T15:00:00Z"),
    ];

    expect(selectStartSlotIndex(remainder)).toBe(0);
  });

  it("falls back to the first slot when the day ends before the morning", () => {
    expect(selectStartSlotIndex([slot("2027-01-24T00:00:00Z", 6)])).toBe(0);
  });
});
