import type { BREvent } from "@sudburyrc/ical-builder";
import emojiRegex from "emoji-regex";
import he from "he";
import DOMPurify from "isomorphic-dompurify";
import { after } from "next/server";
import { dash, tryit } from "radashi";
import { z } from "zod";
import { cached } from "./cached";
import { firecrawl } from "./firecrawl";

const EVENT_CALENDAR_API = "https://calendar.britishrowing.org/calendar.json";
const MAX_COMPETITION_AGE_DAYS = 14;

const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;
const FRESH_FOR_MS = 48 * HOUR_IN_MS;
const KEEP_IN_KV_FOR_MS = 14 * DAY_IN_MS;

const sanitise = (html: string) => {
  const sanitised = he
    .decode(
      DOMPurify.sanitize(html, {
        ALLOWED_ATTR: [],
        ALLOWED_TAGS: [],
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

const HREF_REGEX = /href=['"]([^'"]*)['"]/;

const extractURL = (html: string) => {
  const match = HREF_REGEX.exec(html);

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
    Notes: z.string().transform(sanitise).transform(coerceEmptyStringToNull),
    Region: z.string().transform(sanitise).transform(replaceUglyRegionNames),

    StartDate: z.coerce.date(),
    StatusId: z.int(),
  })
  .transform((event) => {
    const competition = sanitise(event.Competition);
    const url = extractURL(event.Competition);

    return {
      id: dash(`${competition}-${event.StartDate.toISOString().split("T")[0]}`),
      competition,
      cancelled: event.StatusId === 8,
      url,
      notes:
        event.Notes?.trim().toLowerCase() === "cancelled" ? null : event.Notes,
      region: event.Region,
      startDate: event.StartDate,
    };
  });

const ZBREventOutput = z.array(
  z.object({
    cancelled: z.boolean(),
    competition: z.string(),
    id: z.string(),
    notes: z.string().nullable(),
    region: z.string(),
    startDate: z.coerce.date(),
    url: z.string().nullable(),
  }),
) satisfies z.ZodType<BREvent[]>;

const removeStaleEvents = (events: BREvent[]): BREvent[] =>
  events.filter(
    ({ startDate }) =>
      startDate.getTime() >=
      Date.now() - MAX_COMPETITION_AGE_DAYS * 24 * 60 * 60 * 1000,
  );

export const fetchCompetitions = async (
  includeOldEvents?: boolean,
): Promise<BREvent[]> => {
  try {
    const [error, response] = await tryit(() =>
      firecrawl.scrape(EVENT_CALENDAR_API, {
        formats: ["rawHtml"],
      }),
    )();

    if (error) {
      console.warn("Failed to fetch British Rowing calendar:", error);

      return [];
    }

    const rawHtml = response.rawHtml;

    if (!rawHtml) {
      console.warn("Failed to fetch British Rowing calendar: no rawHtml");

      return [];
    }

    const [parsedError, parsed] = await tryit(() => JSON.parse(rawHtml))();

    if (parsedError) {
      console.warn("Failed to parse British Rowing calendar:", parsedError);

      return [];
    }

    const result = z
      .array(ZBREvent)
      .transform(includeOldEvents ? (_) => _ : removeStaleEvents)
      .safeParse(parsed);

    if (!result.success) {
      console.warn(
        "British Rowing calendar returned an unexpected shape:",
        result.error.message,
      );

      return [];
    }

    return result.data;
  } catch (error) {
    console.warn("Failed to fetch British Rowing calendar:", error);

    return [];
  }
};

export const cachedFetchCompetitions: typeof fetchCompetitions = async (
  includeOldEvents,
) => {
  try {
    return await cached({
      checkValue: ZBREventOutput,
      key: `competitions-${includeOldEvents ? "old" : "new"}`,
      staleWhileRevalidate: KEEP_IN_KV_FOR_MS - FRESH_FOR_MS,
      ttl: FRESH_FOR_MS,
      waitUntil: after,
      getFreshValue: async () => {
        const events = await fetchCompetitions(includeOldEvents);

        if (events.length === 0)
          throw new Error("British Rowing calendar returned no events");

        return events;
      },
    });
  } catch (error) {
    console.warn("Failed to fetch British Rowing calendar:", error);

    return [];
  }
};
