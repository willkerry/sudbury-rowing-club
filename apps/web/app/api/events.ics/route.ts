import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { serversideFetchCompetitions } from "@sudburyrc/api";
import IcalBuilder from "@sudburyrc/ical-builder";

const CACHE_KEY = "events-ics";
const CACHE_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const cachedTransformToICS = async () => {
  const cached = await kv.get<string>(CACHE_KEY);

  if (cached) {
    console.log(new Date(), "iCal feed hit cache");
    return cached;
  }

  console.log(new Date(), "iCal feed cold start");

  const events = await serversideFetchCompetitions(true);

  const calendar = new IcalBuilder(
    "SRC Events",
    "Europe/London",
    "Events from the British Rowing Calendar",
  );

  calendar.set(events);

  const icsString = calendar.stringify();
  await kv.set(CACHE_KEY, icsString, { ex: CACHE_TTL_SECONDS });

  return icsString;
};

export const GET = async () => {
  try {
    const iCalFeed = await cachedTransformToICS();

    return new NextResponse(iCalFeed, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=21600",
        "Content-Type": "text/calendar",
        "Content-Disposition": "attachment; filename=ical.ics",
      },
    });
  } catch (error: any) {
    console.error(error);

    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
