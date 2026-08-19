import { describe, expect, it } from "vitest";
import fixture from "./fixtures/locationforecast.json";
import { toForecastDays, toLondonDate } from "./to-forecast-days";

const parse = (f: typeof fixture) =>
  JSON.parse(JSON.stringify(f), (key, value) =>
    key === "time" ? new Date(value) : value,
  );

const days = toForecastDays(parse(fixture));

describe("toLondonDate", () => {
  it("uses the London calendar day, not the UTC one", () => {
    expect(toLondonDate(new Date("2026-08-18T23:30:00Z"))).toBe("2026-08-19");
    expect(toLondonDate(new Date("2026-01-18T23:30:00Z"))).toBe("2026-01-18");
  });
});

describe("toForecastDays", () => {
  it("returns days in ascending order with no duplicates", () => {
    const dates = days.map((day) => day.date);

    expect(dates).toEqual([...dates].sort());
    expect(new Set(dates).size).toBe(dates.length);
  });

  it("assigns every slot to its own London day", () => {
    for (const day of days) {
      for (const slot of day.slots) {
        expect(toLondonDate(slot.time)).toBe(day.date);
      }
    }
  });

  it("orders slots within a day chronologically", () => {
    for (const day of days) {
      const times = day.slots.map((slot) => slot.time.getTime());

      expect(times).toEqual([...times].sort((a, b) => a - b));
    }
  });

  it("orders slots within a day chronologically even when the input is reversed", () => {
    const shuffled = {
      ...fixture,
      properties: {
        ...fixture.properties,
        timeseries: [...fixture.properties.timeseries].reverse(),
      },
    };
    const shuffledDays = toForecastDays(parse(shuffled));

    for (const day of shuffledDays) {
      const times = day.slots.map((slot) => slot.time.getTime());

      expect(times).toEqual([...times].sort((a, b) => a - b));
    }
  });

  it("produces both hourly and six-hourly spans", () => {
    const spans = new Set(days.flatMap((day) => day.slots.map((s) => s.span)));

    expect(spans).toEqual(new Set([1, 6]));
  });

  it("prefers the one-hour period when both are present", () => {
    const first = days[0].slots[0];

    expect(first.span).toBe(1);
  });

  it("derives Beaufort force from metres per second", () => {
    for (const day of days) {
      for (const slot of day.slots) {
        expect(slot.wind.beaufort).toBeGreaterThanOrEqual(0);
        expect(slot.wind.beaufort).toBeLessThanOrEqual(12);
      }
    }
  });

  it("defaults missing precipitation and fog to zero", () => {
    for (const day of days) {
      for (const slot of day.slots) {
        expect(Number.isFinite(slot.precipitation)).toBe(true);
        expect(Number.isFinite(slot.fog)).toBe(true);
      }
    }

    // The 6-hourly entries from 2026-08-22T06:00:00Z onward omit
    // fog_area_fraction from instant.details; the slot must default to 0.
    const aug22 = days.find((d) => d.date === "2026-08-22");
    const slotAt06 = aug22?.slots.find(
      (s) => s.time.toISOString() === "2026-08-22T06:00:00.000Z",
    );

    expect(slotAt06, "expected a slot for 2026-08-22T06:00Z").toBeDefined();
    expect(slotAt06?.fog).toBe(0);

    // No entry in the fixture omits precipitation_amount from its period
    // details, so no precipitation defaulting case can be asserted here.
  });
});
