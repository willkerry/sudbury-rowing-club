import { type NextRequest, NextResponse } from "next/server";
import { getSafetyStatus } from "@/lib/get-safety-status";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";

export const revalidate = 300;

export const GET = async (req: NextRequest) => {
  const maybeRateLimitedResponse = await routeHandlerRatelimiter(req);
  if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

  try {
    const safetyStatus = await getSafetyStatus();
    return NextResponse.json(safetyStatus);
  } catch {
    return new NextResponse("Server error: failed to fetch safety status", {
      status: 500,
    });
  }
};
