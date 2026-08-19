import { getHourlyForecast } from "@/lib/forecast/get-hourly-forecast";
import { getSafetyStatus } from "@/lib/get-safety-status";
import { cached } from "@/lib/server/cached";
import { trackServerEvent } from "@/lib/server/track";
import { rateLimitedProcedure, router } from "../init";

const HOURLY_FORECAST_CACHE_SECONDS = 60 * 10;

/**
 * The river status is safety information, so it is only treated as fresh for
 * five minutes. Beyond that it is still served immediately while a refresh runs
 * behind the request, up to an hour old in total.
 */
const STATUS_TTL_MS = 5 * 60 * 1_000;
const STATUS_STALE_WHILE_REVALIDATE_MS = 55 * 60 * 1_000;

export const safetyRouter = router({
  hourlyForecast: rateLimitedProcedure
    .meta({ cacheSeconds: HOURLY_FORECAST_CACHE_SECONDS })
    .query(() => getHourlyForecast()),
  status: rateLimitedProcedure.query(async () => {
    const safetyStatus = await cached({
      getFreshValue: getSafetyStatus,
      key: "safety-status",
      staleWhileRevalidate: STATUS_STALE_WHILE_REVALIDATE_MS,
      ttl: STATUS_TTL_MS,
    });

    if (safetyStatus.errors && safetyStatus.errors.length > 0) {
      trackServerEvent("safety_api_partial_failure", {
        error_count: safetyStatus.errors.length,
        errors: safetyStatus.errors,
        final_status: safetyStatus.status,
      });
    }

    return safetyStatus;
  }),
});
