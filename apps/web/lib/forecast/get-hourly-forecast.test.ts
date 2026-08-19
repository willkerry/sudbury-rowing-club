import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ForecastDay } from "./to-forecast-days";

// Stable fake data used across tests
const FAKE_DAYS: ForecastDay[] = [
  {
    date: "2026-08-19",
    slots: [],
  },
];

const FAKE_FORECAST = { properties: { timeseries: [] } };
const FAKE_LAST_MODIFIED = "Mon, 19 Aug 2026 09:16:00 GMT";
const FAKE_EXPIRES = "Mon, 19 Aug 2026 09:46:00 GMT"; // 30 minutes from an arbitrary now

// A cachified-shaped context that records the TTL the implementation sets
const makeCacheContext = () => {
  const context = { metadata: {} as { ttl?: number } };
  return context;
};

// A `cached` stub that directly invokes getFreshValue and returns the result,
// making it easy to observe what the implementation writes to context.metadata.ttl.
const makeCachedStub = () =>
  vi.fn(
    async <T>({
      getFreshValue,
    }: {
      getFreshValue: (ctx: { metadata: Record<string, unknown> }) => Promise<T>;
    }): Promise<T> => {
      const ctx = makeCacheContext();
      return await getFreshValue(ctx);
    },
  );

describe("getHourlyForecast", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns mapped days on a fresh fetch and stores lastModified", async () => {
    vi.doMock("@sudburyrc/api", () => ({
      fetchLocationForecast: vi.fn(async () => ({
        expires: FAKE_EXPIRES,
        forecast: FAKE_FORECAST,
        lastModified: FAKE_LAST_MODIFIED,
        status: "fresh",
      })),
    }));

    vi.doMock("@/lib/server/cached", () => ({ cached: makeCachedStub() }));

    vi.doMock("./to-forecast-days", () => ({
      toForecastDays: vi.fn(() => FAKE_DAYS),
    }));

    const { getHourlyForecast } = await import("./get-hourly-forecast");
    const days = await getHourlyForecast();

    expect(days).toEqual(FAKE_DAYS);
  });

  it("passes the stored lastModified to fetchLocationForecast on a second call", async () => {
    const fetchLocationForecast = vi
      .fn()
      .mockResolvedValueOnce({
        expires: FAKE_EXPIRES,
        forecast: FAKE_FORECAST,
        lastModified: FAKE_LAST_MODIFIED,
        status: "fresh",
      })
      .mockResolvedValueOnce({
        expires: FAKE_EXPIRES,
        forecast: FAKE_FORECAST,
        lastModified: FAKE_LAST_MODIFIED,
        status: "fresh",
      });

    vi.doMock("@sudburyrc/api", () => ({ fetchLocationForecast }));

    // cached stub that invokes getFreshValue every call (no in-process caching)
    vi.doMock("@/lib/server/cached", () => ({ cached: makeCachedStub() }));

    vi.doMock("./to-forecast-days", () => ({
      toForecastDays: vi.fn(() => FAKE_DAYS),
    }));

    const { getHourlyForecast } = await import("./get-hourly-forecast");

    await getHourlyForecast();
    await getHourlyForecast();

    // Second call must forward the value stored from the first response
    expect(fetchLocationForecast).toHaveBeenNthCalledWith(
      2,
      FAKE_LAST_MODIFIED,
    );
  });

  it("reuses previous days on a 304 not-modified response", async () => {
    const fetchLocationForecast = vi
      .fn()
      .mockResolvedValueOnce({
        expires: FAKE_EXPIRES,
        forecast: FAKE_FORECAST,
        lastModified: FAKE_LAST_MODIFIED,
        status: "fresh",
      })
      .mockResolvedValueOnce({ status: "not-modified" });

    vi.doMock("@sudburyrc/api", () => ({ fetchLocationForecast }));
    vi.doMock("@/lib/server/cached", () => ({ cached: makeCachedStub() }));
    vi.doMock("./to-forecast-days", () => ({
      toForecastDays: vi.fn(() => FAKE_DAYS),
    }));

    const { getHourlyForecast } = await import("./get-hourly-forecast");

    await getHourlyForecast();
    const days = await getHourlyForecast();

    expect(days).toEqual(FAKE_DAYS);
  });

  it("derives context.metadata.ttl from the Expires header via expiresToTtl", async () => {
    // Use a real expires value 30 min from a fixed now so we can predict the TTL
    const now = new Date("2026-08-19T09:16:00Z");
    const expiresThirtyMinFromNow = new Date(
      now.getTime() + 30 * 60_000,
    ).toUTCString();

    let capturedTtl: number | undefined;

    const cachedStub = vi.fn(
      async <T>({
        getFreshValue,
      }: {
        getFreshValue: (ctx: {
          metadata: Record<string, unknown>;
        }) => Promise<T>;
      }): Promise<T> => {
        const ctx = makeCacheContext();
        const result = await getFreshValue(ctx);
        capturedTtl = ctx.metadata.ttl as number | undefined;
        return result;
      },
    );

    vi.doMock("@sudburyrc/api", () => ({
      fetchLocationForecast: vi.fn(async () => ({
        expires: expiresThirtyMinFromNow,
        forecast: FAKE_FORECAST,
        lastModified: FAKE_LAST_MODIFIED,
        status: "fresh",
      })),
    }));

    vi.doMock("@/lib/server/cached", () => ({ cached: cachedStub }));
    vi.doMock("./to-forecast-days", () => ({
      toForecastDays: vi.fn(() => FAKE_DAYS),
    }));

    // Stub expiresToTtl so we control its return value independently of wall time
    const EXPECTED_TTL = 30 * 60_000;
    vi.doMock("./expires-to-ttl", () => ({
      expiresToTtl: vi.fn(() => EXPECTED_TTL),
      FORECAST_TTL_FLOOR_MS: 10 * 60 * 1000,
    }));

    const { getHourlyForecast } = await import("./get-hourly-forecast");
    await getHourlyForecast();

    expect(capturedTtl).toBe(EXPECTED_TTL);
  });
});
