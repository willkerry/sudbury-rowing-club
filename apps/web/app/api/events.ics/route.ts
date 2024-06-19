import { NextApiRequest, NextApiResponse } from "next";
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
const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "public, s-maxage=21600");

  try {
    const iCalFeed = await cachedTransformToICS();

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", "attachment; filename=ical.ics");
    res.write(iCalFeed);
    res.end();
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }

  res.end();
};

export default events;
