import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { type NextRequest, NextResponse } from "next/server";

export const ratelimiter = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, "10s"),
  redis: kv,
});

export const routeHandlerRatelimiter = async (req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for");

  if (!ip) {
    return new NextResponse("No IP address in request", {
      status: 400,
    });
  }

  const { success, reset } = await ratelimiter.limit(ip);

  if (!success) {
    return new NextResponse("Rate limit exceeded", {
      status: 429,
      headers: {
        "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
      },
    });
  }
};
