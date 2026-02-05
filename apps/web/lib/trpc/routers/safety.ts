import { getSafetyStatus } from "@/lib/get-safety-status";
import { getWeatherForecast } from "@/lib/get-weather-forecast";
import { cached } from "@/lib/server/cached";
import { trackServerEvent, trackServerException } from "@/lib/server/track";
import { rateLimitedProcedure, router } from "../init";

export const safetyRouter = router({
  status: rateLimitedProcedure.query(async () => {
    try {
      const { data: safetyStatus, cachedAt } = await cached({
        key: "safety-status",
        ttl: 60 * 60,
        fn: getSafetyStatus,
      });

      if (safetyStatus.errors && safetyStatus.errors.length > 0) {
        trackServerEvent("safety_api_partial_failure", {
          errors: safetyStatus.errors,
          error_count: safetyStatus.errors.length,
          final_status: safetyStatus.status,
        });
      }

      return { ...safetyStatus, retrievedAt: cachedAt };
    } catch (error) {
      trackServerException(error);
      throw error;
    }
  }),

  forecast: rateLimitedProcedure.query(async () => {
    const { data: forecast } = await cached({
      key: "weather-forecast",
      ttl: 60 * 60 * 12,
      fn: getWeatherForecast,
    });

    return forecast;
  }),
});
