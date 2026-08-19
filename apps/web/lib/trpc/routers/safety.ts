import { getHourlyForecast } from "@/lib/forecast/get-hourly-forecast";
import { getSafetyStatus } from "@/lib/get-safety-status";
import { cached } from "@/lib/server/cached";
import { trackServerEvent, trackServerException } from "@/lib/server/track";
import { rateLimitedProcedure, router } from "../init";

const HOURLY_FORECAST_CACHE_SECONDS = 60 * 10;

export const safetyRouter = router({
  hourlyForecast: rateLimitedProcedure
    .meta({ cacheSeconds: HOURLY_FORECAST_CACHE_SECONDS })
    .query(getHourlyForecast),
  status: rateLimitedProcedure.query(async () => {
    try {
      const safetyStatus = await cached({
        getFreshValue: getSafetyStatus,
        key: "safety-status",
        ttl: 60 * 60 * 1_000,
      });

      if (safetyStatus.errors && safetyStatus.errors.length > 0) {
        trackServerEvent("safety_api_partial_failure", {
          error_count: safetyStatus.errors.length,
          errors: safetyStatus.errors,
          final_status: safetyStatus.status,
        });
      }

      return safetyStatus;
    } catch (error) {
      trackServerException(error);
      throw error;
    }
  }),
});
