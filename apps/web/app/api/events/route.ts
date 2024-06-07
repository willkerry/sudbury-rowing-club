import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { type SRCEvent, serversideFetchCompetitions } from "@sudburyrc/api";

// export const runtime = "edge";
export const revalidate = 86400;

const CACHE_KEY = "events";
const CACHE_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const cachedCompetitionFetch = async () => {
  const cached = await kv.get<SRCEvent[]>(CACHE_KEY);

  if (cached) {
    console.log("Events API hit cache");
    return cached;
  }

  const events = await serversideFetchCompetitions();
  await kv.set(CACHE_KEY, events, { ex: CACHE_TTL_SECONDS });
  console.log("Events cold start");

  return events;
};

export async function GET() {
  try {
    const competitions = await cachedCompetitionFetch();

    return new NextResponse(JSON.stringify(competitions), {
      status: 200,
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}`,
      },
    });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
