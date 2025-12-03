import { type NextRequest, NextResponse } from "next/server";
import { getWeatherForecast } from "@/lib/get-weather-forecast";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { cached } from "@/lib/server/cached";

export const GET = async (req: NextRequest) => {
  const maybeRateLimitedResponse = await routeHandlerRatelimiter(req);
  if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

  try {
    const { data: forecast, headers } = await cached({
      key: "weather-forecast",
      ttl: 60 * 60 * 12, // 12 hours
      fn: getWeatherForecast,
    });
    return NextResponse.json(forecast, { headers });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
};
