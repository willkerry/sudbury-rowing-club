import { fetchLocationForecast } from "@sudburyrc/api";
import { cached } from "@/lib/server/cached";
import { expiresToTtl, FORECAST_TTL_FLOOR_MS } from "./expires-to-ttl";
import { type ForecastDay, toForecastDays } from "./to-forecast-days";

const CACHE_KEY = "met-hourly-forecast";

type ForecastCacheEntry = {
  days: ForecastDay[];
  lastModified: string | null;
};

let previous: ForecastCacheEntry | null = null;

export const getHourlyForecast = async (): Promise<ForecastDay[]> => {
  const entry = await cached<ForecastCacheEntry>({
    key: CACHE_KEY,
    ttl: FORECAST_TTL_FLOOR_MS,
    getFreshValue: async (context) => {
      const result = await fetchLocationForecast(previous?.lastModified);

      if (result.status === "not-modified") {
        if (!previous) {
          throw new Error("MET returned 304 without a previous forecast");
        }

        context.metadata.ttl = FORECAST_TTL_FLOOR_MS;

        return previous;
      }

      context.metadata.ttl = expiresToTtl(result.expires, new Date());
      previous = {
        days: toForecastDays(result.forecast),
        lastModified: result.lastModified,
      };

      return previous;
    },
  });

  return entry.days;
};
