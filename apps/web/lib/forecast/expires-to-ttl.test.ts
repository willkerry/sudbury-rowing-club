import { describe, expect, it } from "vitest";
import {
  expiresToTtl,
  FORECAST_TTL_CEILING_MS,
  FORECAST_TTL_FLOOR_MS,
} from "./expires-to-ttl";

const now = new Date("2026-08-18T18:11:21Z");
const minutesFromNow = (minutes: number) =>
  new Date(now.getTime() + minutes * 60_000).toUTCString();

describe("expiresToTtl", () => {
  it("uses the interval until Expires", () => {
    expect(expiresToTtl(minutesFromNow(32), now)).toBe(32 * 60_000);
  });

  it("floors short intervals", () => {
    expect(expiresToTtl(minutesFromNow(2), now)).toBe(FORECAST_TTL_FLOOR_MS);
  });

  it("floors intervals already in the past", () => {
    expect(expiresToTtl(minutesFromNow(-5), now)).toBe(FORECAST_TTL_FLOOR_MS);
  });

  it("caps long intervals", () => {
    expect(expiresToTtl(minutesFromNow(240), now)).toBe(
      FORECAST_TTL_CEILING_MS,
    );
  });

  it("floors a missing header", () => {
    expect(expiresToTtl(null, now)).toBe(FORECAST_TTL_FLOOR_MS);
  });

  it("floors an unparseable header", () => {
    expect(expiresToTtl("not a date", now)).toBe(FORECAST_TTL_FLOOR_MS);
  });
});
