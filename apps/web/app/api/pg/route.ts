import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { getWodehouseFullDetails } from "get-wodehouse-name";
import { type NextRequest, NextResponse } from "next/server";

export const revalidate = 60;

export const GET = async (req: NextRequest) => {
  const maybeRateLimitedResponse = await routeHandlerRatelimiter(req);
  if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

  try {
    const status = getWodehouseFullDetails();

    return new NextResponse(JSON.stringify(status), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60",
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : error }),
      {
        status: 500,
      },
    );
  }
};
