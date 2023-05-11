import generateICSString from "@/lib/generateICSString";
import { serversideFetchCompetitions } from "@/lib/queries/fetch-competions";
import kv from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

const CACHE_KEY = "events-ics";
const CACHE_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const cachedTransformToICS = async () => {
  const cached = await kv.get<string>(CACHE_KEY);

  if (cached) {
    console.log(new Date(), "iCal feed hit cache");
    return cached;
  }

  const icsString = generateICSString(await serversideFetchCompetitions(true));
  await kv.set(CACHE_KEY, icsString, { ex: CACHE_TTL_SECONDS });
  console.log(new Date(), "iCal feed cold start");

  return icsString;
};

const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=21600");

  try {
    const iCalFeed = await cachedTransformToICS();

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", "attachment; filename=ical.ics");
    res.write(iCalFeed);
    res.end();
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }

  res.end();
};

export default events;
