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

const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=21600");

  try {
    const brCalendarResponse = await fetch(EVENT_CALENDAR_API);
    const brCalendarJSON = await brCalendarResponse.json();

    // Validate the response against the Zod schema (i.e. fail fast if BR change their API)
    const validated = z.array(ZBREvent).parse(brCalendarJSON);
    // Strip out HTML and JSify the field names
    const sanitised = sanitiseAndRename(validated);

    // Filter out events that occurred more than 2 weeks ago
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const filtered = sanitised.filter(
      (event) => new Date(event.startDate) >= twoWeeksAgo
    );

    res.status(200).json(filtered);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }

  res.end();
};

export default events;
