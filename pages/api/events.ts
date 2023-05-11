import kv from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import he from "he";
import emojiRegex from "emoji-regex";

const EVENT_CALENDAR_API = "https://calendar.britishrowing.org/calendar.json";

const ZBREvent = z.object({
  MeetingDate: z.string(),
  Competition: z.string(),
  StatusId: z.number(),
  Notes: z.string(),

  MeetClass: z.string(),
  CompClass: z.string(),
  NoteClass: z.string(),

  StartDate: z.string(),
  Region: z.string(),
});

type BREvent = z.infer<typeof ZBREvent>;

export const ZSRCEvent = z.object({
  id: z.string(),
  competition: z.string(),
  url: z.string().nullable(),
  status: z.number(),
  notes: z.string().nullable(),

  startDate: z.string().transform((date) => new Date(date).toISOString()),
  region: z.string(),
});

type SRCEvent = z.infer<typeof ZSRCEvent>;

const stripHTML = (html: string) =>
  he
    .decode(
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      })
    )
    .replace(emojiRegex(), "")
    .trim();

const illegalCharacters = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

const stripIllegalCharacters = (url: string) => {
  let stripped = url;

  illegalCharacters.forEach((character) => {
    stripped = stripped.replace(character, "");
  });

  return stripped;
};

const extractURL = (html: string) => {
  const match = html.match(/href=['"]([^'"]*)['"]/);

  if (match) return stripIllegalCharacters(match[1]);

  return null;
};

const coerceEmptyStringToNull = (value: string) => {
  if (value.trim() === "") return null;

  return value;
};

const sanitiseAndRename = (events: BREvent[]): SRCEvent[] =>
  z.array(ZSRCEvent).parse(
    events.map(({ Competition, StatusId, Notes, StartDate, Region }) => ({
      id: `${stripHTML(Competition)}-${StartDate}`.replace(/[^a-zA-Z0-9]/g, ""),

      competition: stripHTML(Competition),
      url: extractURL(Competition),
      status: StatusId,
      notes: coerceEmptyStringToNull(stripHTML(Notes)),

      startDate: stripHTML(StartDate),
      region: stripHTML(Region),
    }))
  );

const fetchTransformAndCacheEvents = async () => {
  const KEY = "events";
  const TTL_SECONDS = 60 * 60 * 12; // 12 hours

  const cached = await kv.get<SRCEvent[]>(KEY);

  if (cached) {
    console.log(new Date(), "Events API hit cache");
    return cached;
  }

  const brCalendarResponse = await fetch(EVENT_CALENDAR_API);
  const brCalendarJSON = await brCalendarResponse.json();

  const validated = z.array(ZBREvent).parse(brCalendarJSON);
  const sanitised = sanitiseAndRename(validated);

  // Filter out events that occurred more than 2 weeks ago
  const now = new Date();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const filtered = sanitised.filter(
    (event) => new Date(event.startDate) >= twoWeeksAgo
  );

  await kv.set(KEY, filtered, { ex: TTL_SECONDS });
  console.log(new Date(), "Events cold start");
  return filtered;
};

const dateToiCalDayFormat = (date: Date) =>
  date.toISOString().replace(/T.*/, "").replace(/-/g, "");

const createICSString = (events: SRCEvent[]) => {
  const preamble = `BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//SRC//Events//EN
  X-WR-CALNAME:SRC Events
  X-WR-TIMEZONE:Europe/London
  X-WR-CALDESC:Events from the British Rowing Calendar
  `;

  const icsString = events.reduce(
    (acc, event) =>
      `${acc}BEGIN:VEVENT
  UID:${event.id}
  DTSTAMP:${new Date(event.startDate).toISOString().replace(/[-:]/g, "")}
  DTSTART:${dateToiCalDayFormat(new Date(event.startDate))}
  SUMMARY:${event.competition}
  DESCRIPTION:${event.notes}
  URL:${event.url}
  END:VEVENT
  `,
    preamble
  );

  return `${icsString}END:VCALENDAR`;
};

const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=21600");

  try {
    const events = await fetchTransformAndCacheEvents();

    if (req.query.ical) {
      res.setHeader("Content-Type", "text/calendar");
      res.setHeader("Content-Disposition", "attachment; filename=events.ics");

      res.write(createICSString(events));
      res.end();
      return;
    }

    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }

  res.end();
};

export default events;
