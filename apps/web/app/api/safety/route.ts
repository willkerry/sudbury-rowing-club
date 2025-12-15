import { type NextRequest, NextResponse } from "next/server";
import { getSafetyStatus } from "@/lib/get-safety-status";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { cached } from "@/lib/server/cached";
import { trackServerEvent, trackServerException } from "@/lib/server/track";

export const GET = async (req: NextRequest) => {
  const maybeRateLimitedResponse = await routeHandlerRatelimiter(req);
  if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

  try {
    const { data: safetyStatus, headers } = await cached({
      key: "safety-status",
      ttl: 60 * 60, // 1 hour
      fn: getSafetyStatus,
    });

    if (safetyStatus.errors && safetyStatus.errors.length > 0) {
      trackServerEvent("safety_api_partial_failure", {
        errors: safetyStatus.errors,
        error_count: safetyStatus.errors.length,
        final_status: safetyStatus.status,
      });
    }

    return NextResponse.json(safetyStatus, { headers });
  } catch (error) {
    trackServerException(error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
};
