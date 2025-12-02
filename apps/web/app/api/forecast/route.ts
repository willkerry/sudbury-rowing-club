import { type NextRequest, NextResponse } from "next/server";
import { getWeatherForecast } from "@/lib/get-weather-forecast";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";

export const revalidate = 300;

export const GET = async (req: NextRequest) => {
  const maybeRateLimitedResponse = await routeHandlerRatelimiter(req);
  if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

  try {
    const forecast = await getWeatherForecast();
    return NextResponse.json(forecast);
  } catch {
    return new NextResponse("Server error: failed to fetch weather forecast", {
      status: 500,
    });
  }
};
