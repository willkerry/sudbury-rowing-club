import fixture from "@sudburyrc/api/tests/fixtures/locationforecast.json";
import { SYMBOL_CODES } from "@sudburyrc/weathericons";
import { describe, expect, it } from "vitest";
import { toForecastDays } from "./to-forecast-days";

const parse = (f: typeof fixture) =>
  JSON.parse(JSON.stringify(f), (key, value) =>
    key === "time" ? new Date(value) : value,
  );

const days = toForecastDays(parse(fixture));

describe("toForecastDays", () => {
  it("returns days in ascending order with no duplicates", () => {
    const dates = days.map((day) => day.date);

    expect(dates).toEqual([...dates].sort());
    expect(new Set(dates).size).toBe(dates.length);
  });

  it("groups a late-evening UTC entry into the correct London BST day", () => {
    // 2026-08-21T23:00:00Z is 2026-08-22 00:00 BST (UTC+1).
    // Grouping on the raw UTC date string would place it on 2026-08-21.
    const [aug22] = toForecastDays(
      parse({
        properties: {
          timeseries: [
            {
              time: "2026-08-21T23:00:00Z",
              data: {
                next_1_hours: { summary: { symbol_code: "cloudy" } },
                instant: {
                  details: {
                    air_temperature: 15,
                    wind_from_direction: 0,
                    wind_speed: 1,
                  },
                },
              },
            },
          ],
        },
      } as typeof fixture),
    );

    expect(aug22?.date).toBe("2026-08-22");

    const slotAtMidnight = aug22?.slots.find(
      (s) => s.time.toISOString() === "2026-08-21T23:00:00.000Z",
    );

    expect(
      slotAtMidnight,
      "2026-08-21T23:00Z should land on 2026-08-22 in London",
    ).toBeDefined();
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

  it("never mixes hourly and six-hourly slots within a day", () => {
    for (const day of days) {
      expect(new Set(day.slots.map((s) => s.span)).size, day.date).toBe(1);
    }
  });

  it("rebuilds the transition day as contiguous six-hour blocks", () => {
    // 2026-08-22 has an hourly 00:00 BST entry before MET switches to
    // six-hourly at 01:00 BST, which must not survive as a stray hour.
    const aug22 = days.find((d) => d.date === "2026-08-22");

    expect(aug22?.slots.map((s) => s.time.toISOString())).toEqual([
      "2026-08-22T00:00:00.000Z",
      "2026-08-22T06:00:00.000Z",
      "2026-08-22T12:00:00.000Z",
      "2026-08-22T18:00:00.000Z",
    ]);
    expect(aug22?.slots.every((s) => s.span === 6)).toBe(true);
  });

  it("uses next_6_hours from an hourly entry on a block boundary", () => {
    const entry = (time: string, hourly: boolean) => ({
      time,
      data: {
        instant: {
          details: {
            air_temperature: 10,
            wind_from_direction: 0,
            wind_speed: 1,
          },
        },
        ...(hourly && { next_1_hours: { summary: { symbol_code: "rain" } } }),
        next_6_hours: {
          details: { air_temperature_max: 12, air_temperature_min: 6 },
          summary: { symbol_code: "cloudy" },
        },
      },
    });

    const [day] = toForecastDays(
      parse({
        properties: {
          timeseries: [
            entry("2026-11-15T00:00:00Z", true),
            entry("2026-11-15T01:00:00Z", true),
            entry("2026-11-15T06:00:00Z", false),
          ],
        },
      } as typeof fixture),
    );

    expect(day.slots).toMatchObject([
      { span: 6, symbol: "cloudy", temperatureMax: 12, temperatureMin: 6 },
      { span: 6 },
    ]);
  });

  it("prefers the one-hour period when both are present", () => {
    const first = days[0].slots[0];

    expect(first.span).toBe(1);
  });

  it("discards an entry that has neither next_1_hours nor next_6_hours", () => {
    // The fixture's final entry (2026-08-29T00:00Z) has no next_*_hours.
    // It must not appear in any day's slots.
    const allTimes = days.flatMap((d) =>
      d.slots.map((s) => s.time.toISOString()),
    );

    expect(allTimes).not.toContain("2026-08-29T00:00:00.000Z");
  });

  it("converts wind speed from m/s to Beaufort correctly", () => {
    // The code multiplies m/s by 3.6 before calling convertKphToBeaufort.
    // Thresholds in kph: [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118]
    // The 10 m/s case is the critical one: 10*3.6=36 kph => force 5.
    // Without the 3.6 factor: 10 kph => force 2 (wrong).
    //
    // We create a minimal one-entry forecast at a known wind_speed and assert
    // the Beaufort force derived by toForecastDays.
    const cases: [number, number][] = [
      [0, 0], // calm
      [1.0, 1], // 3.6 kph => force 1
      [3.34, 3], // 12.02 kph => force 3 (just below 12 threshold)
      [10.0, 5], // 36 kph => force 5; would be 2 without 3.6 factor
      [13.9, 7], // 50.04 kph => force 7
    ];

    for (const [ms, expectedForce] of cases) {
      const entry = {
        time: "2026-08-20T12:00:00Z",
        data: {
          instant: {
            details: {
              air_temperature: 15,
              fog_area_fraction: 0,
              wind_from_direction: 270,
              wind_speed: ms,
            },
          },
          next_1_hours: {
            details: { precipitation_amount: 0 },
            summary: { symbol_code: "cloudy" },
          },
        },
      };

      const result = toForecastDays(
        parse({
          properties: { timeseries: [entry] },
        } as typeof fixture),
      );

      expect(
        result[0]?.slots[0]?.wind.beaufort,
        `${ms} m/s should be Beaufort ${expectedForce}`,
      ).toBe(expectedForce);
    }
  });

  it("derives Beaufort force from metres per second (range check)", () => {
    for (const day of days) {
      for (const slot of day.slots) {
        expect(slot.wind.beaufort).toBeGreaterThanOrEqual(0);
        expect(slot.wind.beaufort).toBeLessThanOrEqual(12);
      }
    }
  });

  it("defaults missing fog to zero", () => {
    for (const day of days) {
      for (const slot of day.slots) {
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
  });

  it("every symbol_code in the fixture resolves to a known weathericon", () => {
    const allCodes = new Set(
      days.flatMap((d) => d.slots.map((s) => s.symbol as string)),
    );

    for (const code of allCodes) {
      expect(
        SYMBOL_CODES.includes(code as (typeof SYMBOL_CODES)[number]),
        `symbol_code "${code}" from fixture is not in the weathericons package`,
      ).toBe(true);
    }
  });
});
