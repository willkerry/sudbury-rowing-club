import {
  type SRCEvent,
  serversideFetchCompetitions,
} from "@/lib/queries/fetch-competions";
import kv from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

const cachedCompetitionFetch = async () => {
  const KEY = "events";
  const TTL_SECONDS = 60 * 60 * 12; // 12 hours

  const cached = await kv.get<SRCEvent[]>(KEY);

  if (cached) {
    console.log(new Date(), "Events API hit cache");
    return cached;
  }

  const events = await serversideFetchCompetitions();
  await kv.set(KEY, events, { ex: TTL_SECONDS });
  console.log(new Date(), "Events cold start");

  return events;
};

const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=21600");

  try {
    res.status(200).json(await cachedCompetitionFetch());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }

  res.end();
};

export default events;
