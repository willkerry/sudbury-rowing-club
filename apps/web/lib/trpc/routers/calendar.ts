import { serversideFetchCompetitions } from "@sudburyrc/api";
import IcalBuilder from "@sudburyrc/ical-builder";
import { kv } from "@vercel/kv";
import { rateLimitedProcedure, router } from "../init";

const CACHE_KEY = "events-ics";
const CACHE_TTL_SECONDS = 60 * 60 * 12;

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

export const calendarRouter = router({
  events: rateLimitedProcedure.query(cachedTransformToICS),
});
