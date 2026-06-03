import emojiRegex from "emoji-regex";
import he from "he";
import DOMPurify from "isomorphic-dompurify";
import { dash } from "radashi";
import { z } from "zod";

const EVENT_CALENDAR_API = "https://calendar.britishrowing.org/calendar.json";
const MAX_COMPETITION_AGE_DAYS = 14;
const REVALIDATE_SECONDS = 60 * 60 * 12;

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

export type BREvent = z.infer<typeof ZBREvent>;

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
    const response = await fetch(EVENT_CALENDAR_API, {
      next: { revalidate: REVALIDATE_SECONDS },
    } as RequestInit);

    if (!response.ok) {
      console.warn(
        `British Rowing calendar returned ${response.status} ${response.statusText}`,
      );

      return [];
    }

    if (response.headers.get("cf-mitigated") === "challenge") {
      console.warn(
        "British Rowing calendar served a Cloudflare challenge (cf-mitigated: challenge)",
      );

      return [];
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.toLowerCase().includes("json")) {
      console.warn(
        `British Rowing calendar returned non-JSON content-type "${contentType}"`,
      );

      return [];
    }

    const result = z
      .array(ZBREvent)
      .transform(includeOldEvents ? (_) => _ : removeStaleEvents)
      .safeParse(await response.json());

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

export const fetchCompetitionById = async (id: string) => {
  const competitions = await fetchCompetitions();

  return competitions.find((competition) => competition.id === id);
};

export const fetchRegions = async () => {
  const competitions = await fetchCompetitions();

  const regions = new Set(competitions.map(({ region }) => region));

  return Array.from(regions);
};
