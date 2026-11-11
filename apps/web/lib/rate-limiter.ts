import { env } from "cloudflare:workers";
import { type NextRequest, NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";

// Keep in step with the RATE_LIMITER binding in wrangler.jsonc (10 per 10s).
const RATE_LIMIT_PERIOD_SECONDS = 10;

export const ratelimiter = {
  limit: (key: string) => env.RATE_LIMITER.limit({ key }),
};

export const routeHandlerRatelimiter = async (req: NextRequest) => {
  const ip = getClientIp(req.headers);

  if (!ip) {
    return new NextResponse("No IP address in request", {
      status: 400,
    });
  }

  const { success } = await ratelimiter.limit(ip);

  if (!success) {
    return new NextResponse("Rate limit exceeded", {
      status: 429,
      headers: {
        "Retry-After": RATE_LIMIT_PERIOD_SECONDS.toString(),
      },
    });
  }
};
