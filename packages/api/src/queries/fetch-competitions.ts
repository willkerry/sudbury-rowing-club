import emojiRegex from "emoji-regex";
import he from "he";
import DOMPurify from "isomorphic-dompurify";
import { dash } from "radash";
import { z } from "zod";

const EVENT_CALENDAR_API = "https://calendar.britishrowing.org/calendar.json";
const MAX_COMPETITION_AGE_DAYS = 14;

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

  for (const character of WHITESPACE) {
    stripped = stripped.replace(character, "");
  }

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

const REGION_REPLACEMENT_TABLE = new Map<string, string>([
  ["Thames SouthEast", "Thames Southeast"],
]);
const replaceUglyRegionNames = (region: string) =>
  REGION_REPLACEMENT_TABLE.get(region) || region;

const ZBREvent = z
  .object({
    Competition: z.string(),
    StatusId: z.int(),
    Notes: z.string().transform(sanitise).transform(coerceEmptyStringToNull),

    StartDate: z.coerce.date(),
    Region: z.string().transform(sanitise).transform(replaceUglyRegionNames),
  })
  .transform((event) => {
    const competition = sanitise(event.Competition);
    const url = extractURL(event.Competition);

    console.log({ event });

    return {
      id: dash(`${competition}-${event.StartDate.toISOString().split("T")[0]}`),
      competition,
      cancelled: event.StatusId === 8,
      url,
      notes: event.Notes,
      startDate: event.StartDate,
      region: event.Region,
    };
  });

export type BREvent = z.infer<typeof ZBREvent>;

const serversideFetchCompetitions = async (includeOldEvents?: boolean) => {
  const brCalendarResponse = await fetch(EVENT_CALENDAR_API);
  const brCalendarJSON = await brCalendarResponse.json();

  return z
    .array(ZBREvent)
    .transform((events) => ({
      events: includeOldEvents
        ? events
        : events.filter(
            ({ startDate }) =>
              startDate.getTime() >=
              Date.now() - MAX_COMPETITION_AGE_DAYS * 24 * 60 * 60 * 1000,
          ),
      regions: Array.from(new Set(events.map(({ region }) => region))),
    }))
    .parse(brCalendarJSON);
};

export { serversideFetchCompetitions };
