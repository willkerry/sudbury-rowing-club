import { fetchLocationForecast } from "@sudburyrc/api";
import { cached, getCachedEntry } from "@/lib/server/cached";
import { expiresToTtl, FORECAST_TTL_FLOOR_MS } from "./expires-to-ttl";
import { type ForecastDay, toForecastDays } from "./to-forecast-days";

const CACHE_KEY = "met-hourly-forecast";

/**
 * Keeps the entry readable well past its fresh window so revalidation can send
 * If-Modified-Since and treat MET's 304 as a cheap refresh, which their terms
 * of use require of us.
 */
const STALE_WHILE_REVALIDATE_MS = 6 * 60 * 60 * 1_000;

type ForecastCacheEntry = {
  days: ForecastDay[];
  lastModified: string | null;
};

export const getHourlyForecast = async (): Promise<ForecastDay[]> => {
  const entry = await cached<ForecastCacheEntry>({
    key: CACHE_KEY,
    staleWhileRevalidate: STALE_WHILE_REVALIDATE_MS,
    ttl: FORECAST_TTL_FLOOR_MS,
    getFreshValue: async (context) => {
      const stale = await getCachedEntry<ForecastCacheEntry>(CACHE_KEY);
      const result = await fetchLocationForecast(stale?.lastModified);

      context.metadata.ttl = expiresToTtl(result.expires, new Date());

      if (result.status === "not-modified") {
        if (!stale) {
          throw new Error("MET returned 304 without a cached forecast");
        }

        return stale;
      }

      return {
        days: toForecastDays(result.forecast),
        lastModified: result.lastModified,
      };
    },
  });

  return entry.days;
};
