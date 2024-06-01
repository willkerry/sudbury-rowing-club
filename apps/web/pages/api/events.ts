import { type SRCEvent, serversideFetchCompetitions } from "@sudburyrc/api";
import { kv } from "@vercel/kv";
import type { NextApiRequest, NextApiResponse } from "next";

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

const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "public, s-maxage=21600");

  try {
    res.status(200).json(await cachedCompetitionFetch());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }

  res.end();
};

export default events;
