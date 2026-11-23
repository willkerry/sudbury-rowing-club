import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ForecastDay } from "./to-forecast-days";

const FAKE_DAYS: ForecastDay[] = [
  {
    date: "2026-08-19",
    slots: [],
  },
];

const FAKE_FORECAST = { properties: { timeseries: [] } };
const FAKE_LAST_MODIFIED = "Mon, 19 Aug 2026 09:16:00 GMT";
const FAKE_EXPIRES = "Mon, 19 Aug 2026 09:46:00 GMT";

/**
 * Stands in for the shared KV cache: `cached` always refetches so every call
 * exercises getFreshValue, but the entry it writes stays readable through
 * `getCachedEntry`, which is how revalidation finds the previous Last-Modified.
 */
const makeCacheStubs = () => {
  const store = new Map<string, unknown>();
  const metadata: { ttl?: number } = {};

  const cached = vi.fn(
    async <T>({
      getFreshValue,
      key,
    }: {
      getFreshValue: (ctx: { metadata: { ttl?: number } }) => Promise<T>;
      key: string;
    }): Promise<T> => {
      const value = await getFreshValue({ metadata });
      store.set(key, value);

      return value;
    },
  );

  const getCachedEntry = vi.fn(async (key: string) => store.get(key) ?? null);

  return { cached, getCachedEntry, metadata, store };
};

const mockToForecastDays = () => {
  vi.doMock("./to-forecast-days", () => ({
    toForecastDays: vi.fn(() => FAKE_DAYS),
  }));
};

describe("getHourlyForecast", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns mapped days from a fresh fetch", async () => {
    vi.doMock("@sudburyrc/api", () => ({
      fetchLocationForecast: vi.fn(async () => ({
        expires: FAKE_EXPIRES,
        forecast: FAKE_FORECAST,
        lastModified: FAKE_LAST_MODIFIED,
        status: "fresh",
      })),
    }));

    vi.doMock("@/lib/server/cached", () => makeCacheStubs());
    mockToForecastDays();

    const { getHourlyForecast } = await import("./get-hourly-forecast");

    expect(await getHourlyForecast()).toEqual(FAKE_DAYS);
  });

  it("revalidates with the Last-Modified value held in the cache, not in process memory", async () => {
    const fetchLocationForecast = vi.fn().mockResolvedValue({
      expires: FAKE_EXPIRES,
      forecast: FAKE_FORECAST,
      lastModified: FAKE_LAST_MODIFIED,
      status: "fresh",
    });

    vi.doMock("@sudburyrc/api", () => ({ fetchLocationForecast }));
    vi.doMock("@/lib/server/cached", () => makeCacheStubs());
    mockToForecastDays();

    const { getHourlyForecast } = await import("./get-hourly-forecast");

    await getHourlyForecast();
    await getHourlyForecast();

    expect(fetchLocationForecast).toHaveBeenNthCalledWith(1, undefined);
    expect(fetchLocationForecast).toHaveBeenNthCalledWith(
      2,
      FAKE_LAST_MODIFIED,
    );
  });

  it("reuses the cached days on a 304 not-modified response", async () => {
    const fetchLocationForecast = vi
      .fn()
      .mockResolvedValueOnce({
        expires: FAKE_EXPIRES,
        forecast: FAKE_FORECAST,
        lastModified: FAKE_LAST_MODIFIED,
        status: "fresh",
      })
      .mockResolvedValueOnce({ expires: FAKE_EXPIRES, status: "not-modified" });

    vi.doMock("@sudburyrc/api", () => ({ fetchLocationForecast }));
    vi.doMock("@/lib/server/cached", () => makeCacheStubs());
    mockToForecastDays();

    const { getHourlyForecast } = await import("./get-hourly-forecast");

    await getHourlyForecast();

    expect(await getHourlyForecast()).toEqual(FAKE_DAYS);
  });

  it("refuses a 304 that arrives with nothing cached to reuse", async () => {
    vi.doMock("@sudburyrc/api", () => ({
      fetchLocationForecast: vi.fn(async () => ({
        expires: FAKE_EXPIRES,
        status: "not-modified",
      })),
    }));

    vi.doMock("@/lib/server/cached", () => makeCacheStubs());
    mockToForecastDays();

    const { getHourlyForecast } = await import("./get-hourly-forecast");

    await expect(getHourlyForecast()).rejects.toThrow(
      "MET returned 304 without a cached forecast",
    );
  });

  it("derives the cache TTL from the Expires header", async () => {
    const stubs = makeCacheStubs();
    const EXPECTED_TTL = 30 * 60_000;

    vi.doMock("@sudburyrc/api", () => ({
      fetchLocationForecast: vi.fn(async () => ({
        expires: FAKE_EXPIRES,
        forecast: FAKE_FORECAST,
        lastModified: FAKE_LAST_MODIFIED,
        status: "fresh",
      })),
    }));

    vi.doMock("@/lib/server/cached", () => stubs);
    mockToForecastDays();
    vi.doMock("./expires-to-ttl", () => ({
      expiresToTtl: vi.fn(() => EXPECTED_TTL),
      FORECAST_TTL_FLOOR_MS: 10 * 60 * 1000,
    }));

    const { getHourlyForecast } = await import("./get-hourly-forecast");
    await getHourlyForecast();

    expect(stubs.metadata.ttl).toBe(EXPECTED_TTL);
  });

  it("honours the Expires header returned alongside a 304", async () => {
    const stubs = makeCacheStubs();
    const expiresToTtl = vi.fn(() => 30 * 60_000);

    vi.doMock("@sudburyrc/api", () => ({
      fetchLocationForecast: vi
        .fn()
        .mockResolvedValueOnce({
          expires: FAKE_EXPIRES,
          forecast: FAKE_FORECAST,
          lastModified: FAKE_LAST_MODIFIED,
          status: "fresh",
        })
        .mockResolvedValueOnce({
          expires: "Mon, 19 Aug 2026 10:16:00 GMT",
          status: "not-modified",
        }),
    }));

    vi.doMock("@/lib/server/cached", () => stubs);
    mockToForecastDays();
    vi.doMock("./expires-to-ttl", () => ({
      expiresToTtl,
      FORECAST_TTL_FLOOR_MS: 10 * 60 * 1000,
    }));

    const { getHourlyForecast } = await import("./get-hourly-forecast");

    await getHourlyForecast();
    await getHourlyForecast();

    expect(expiresToTtl).toHaveBeenNthCalledWith(
      2,
      "Mon, 19 Aug 2026 10:16:00 GMT",
      expect.any(Date),
    );
  });
});
