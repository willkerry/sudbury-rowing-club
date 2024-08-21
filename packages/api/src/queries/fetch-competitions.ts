import { z } from "zod";
import he from "he";
import emojiRegex from "emoji-regex";
import DOMPurify from "isomorphic-dompurify";

const EVENT_CALENDAR_API = "https://calendar.britishrowing.org/calendar.json";
const MAX_COMPETITION_AGE_DAYS = 14;

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

const ZSRCEvent = z.object({
  id: z.string(),
  competition: z.string(),
  url: z.string().nullable(),
  status: z.number(),
  notes: z.string().nullable(),

  startDate: z.string().transform((date) => new Date(date).toISOString()),
  region: z.string(),
});

export type BREvent = z.infer<typeof ZBREvent>;
export type SRCEvent = z.infer<typeof ZSRCEvent>;

const sanitise = (html: string) => {
  const sanitised = he
    .decode(
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      }),
    )
    .replace(emojiRegex(), "")
    .trim();

  return sanitised.toString();
};

const removeWhitespace = (url: string) => {
  const WHITESPACE = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

  let stripped = url;

  WHITESPACE.forEach((character) => {
    stripped = stripped.replace(character, "");
  });

  return stripped;
};

const extractURL = (html: string) => {
  const match = /href=['"]([^'"]*)['"]/.exec(html);

  if (match) return removeWhitespace(match[1]);

  return null;
};

const coerceEmptyStringToNull = (value: string) => {
  if (value.trim() === "") return null;

  return value;
};

const filterOutOldEvents = (events: BREvent[]) => {
  const now = new Date();
  const maxAge = new Date(
    now.getTime() - MAX_COMPETITION_AGE_DAYS * 24 * 60 * 60 * 1000,
  );

  return events.filter((event) => new Date(event.StartDate) >= maxAge);
};

const REGION_REPLACEMENT_TABLE = new Map<string, string>([
  ["Thames SouthEast", "Thames Southeast"],
]);

const replaceUglyRegionNames = (region: string) => {
  if (REGION_REPLACEMENT_TABLE.has(region)) {
    return REGION_REPLACEMENT_TABLE.get(region);
  }

  return region;
};

const transformCompetions = (events: BREvent[]) =>
  z.array(ZSRCEvent).parse(
    events.map(({ Competition, StatusId, Notes, StartDate, Region }) => ({
      id: `${sanitise(Competition)}-${StartDate}`.replace(/[^a-zA-Z0-9]/g, ""),

      competition: sanitise(Competition),
      url: extractURL(Competition),
      status: StatusId,
      notes: coerceEmptyStringToNull(sanitise(Notes)),

      startDate: sanitise(StartDate),
      region: replaceUglyRegionNames(sanitise(Region)),
    })),
  );

const serverSideFetchCompetitionsFromBR = async () => {
  const brCalendarResponse = await fetch(EVENT_CALENDAR_API);
  const brCalendarJSON = await brCalendarResponse.json();

  return z.array(ZBREvent).parse(brCalendarJSON);
};

const serversideFetchCompetitions = async (includeOldEvents?: boolean) =>
  transformCompetions(
    includeOldEvents
      ? await serverSideFetchCompetitionsFromBR()
      : filterOutOldEvents(await serverSideFetchCompetitionsFromBR()),
  );

export { serversideFetchCompetitions };
