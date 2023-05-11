import generateICSString from "@/lib/generateICSString";
import { serversideFetchCompetitions } from "@/lib/queries/fetch-competions";
import kv from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

const cachedTransformToICS = async () => {
  const KEY = "events-ics";
  const TTL_SECONDS = 60 * 60 * 12; // 12 hours

  const cached = await kv.get<string>(KEY);

  if (cached) {
    console.log(new Date(), "Events API hit cache");
    return cached;
  }

  const icsString = generateICSString(await serversideFetchCompetitions(true));
  await kv.set(KEY, icsString, { ex: TTL_SECONDS });
  console.log(new Date(), "Events cold start");

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
