import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

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
  date: z.string(),
  competition: z.string(),
  url: z.string().nullable(),
  status: z.number(),
  notes: z.string().optional(),

  meetClass: z.string(),
  compClass: z.string(),
  noteClass: z.string(),

  startDate: z.string(),
  region: z.string(),
});

type SRCEvent = z.infer<typeof ZSRCEvent>;

const stripHTML = (html: string) =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

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

const sanitiseAndRename = (events: BREvent[]): SRCEvent[] =>
  events.map(
    ({
      MeetingDate,
      Competition,
      StatusId,
      Notes,
      MeetClass,
      CompClass,
      NoteClass,
      StartDate,
      Region,
    }) => ({
      date: stripHTML(MeetingDate),
      competition: stripHTML(Competition).split("&nbsp;🌍")[0],
      url: extractURL(Competition),
      status: StatusId,
      notes: stripHTML(Notes),

      meetClass: MeetClass,
      compClass: CompClass,
      noteClass: NoteClass,

      startDate: stripHTML(StartDate),
      region: stripHTML(Region),
    })
  );

const events = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405);
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate");

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