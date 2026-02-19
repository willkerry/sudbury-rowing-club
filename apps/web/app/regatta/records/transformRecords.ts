import { slug } from "github-slugger";
import { z } from "zod";
import recordJson from "./records.json";

const parseDuration = (durationString: string) => {
  const [minutesStr, secondsStr] = durationString.split(":");

  const minutes = Number.parseInt(minutesStr, 10) || 0;
  const seconds = Number.parseInt(secondsStr, 10) || 0;

  return { minutes, seconds };
};

export const formatDuration = (duration: {
  minutes: number;
  seconds: number;
}) => {
  const minutes = duration.minutes;
  const seconds = duration.seconds;

  const centeredColon = "";

  return `${minutes}${centeredColon}${seconds.toString().padStart(2, "0")}`;
};

export const formatVerboseDuration = (duration: {
  minutes: number;
  seconds: number;
}) => {
  if (duration.minutes === 0) {
    return `${duration.seconds} seconds`;
  }
  if (duration.seconds === 0) {
    return `${duration.minutes} minute${duration.minutes > 1 ? "s" : ""} and 0 seconds`;
  }
  return `${duration.minutes} minute${duration.minutes > 1 ? "s" : ""} and ${duration.seconds} second${duration.seconds > 1 ? "s" : ""}`;
};

const prettifyBoatnames = (boatname: string) =>
  boatname.replace(/(\d)x/g, "$1×");

const RecordSchema = z
  .object({
    boat: z.string().transform(prettifyBoatnames),
    club: z.string(),
    event: z.string().transform(prettifyBoatnames),
    name: z.string(),
    round: z.union([z.literal("F"), z.literal("S"), z.literal("Q")]),
    time: z.string().transform(parseDuration),
    year: z.string().transform((year) => new Date(year)),
  })
  .transform((record) => ({
    ...record,
    slug: slugify(record.event),
  }));

export type Record = z.infer<typeof RecordSchema>;

export const transformRecords = (records: typeof recordJson) =>
  RecordSchema.array().parse(records);

const REGEXES = {
  coxedFour: /4\+/g,
  coxedPair: /2\+/g,
  coxedQuad: /4[x×]\+/g,
  coxlessFour: /4-/g,
  coxlessQuad: /4[x×]-/g,
  double: /2[x×]/g,
  eight: /8\+/g,
  octuple: /8[x×]/g,
  pair: /2-/g,
  quad: /4[x×](?![+-])/g,
  single: /1[x×]/g,
};

export const slugify = (event: string) => {
  // Replace boat class notation with full names
  const replacedEvent = event
    .replace(REGEXES.eight, "eight")
    .replace(REGEXES.octuple, "octuple")
    .replace(REGEXES.coxedFour, "coxed four")
    .replace(REGEXES.coxlessFour, "coxless four")
    .replace(REGEXES.coxedQuad, "coxed quad")
    .replace(REGEXES.coxlessQuad, "coxless quad")
    .replace(REGEXES.quad, "quad")
    .replace(REGEXES.coxedPair, "coxed pair")
    .replace(REGEXES.pair, "pair")
    .replace(REGEXES.double, "double")
    .replace(REGEXES.single, "single");

  return slug(replacedEvent);
};

export const getSlugifiedRecords = (): Record[] => transformRecords(recordJson);

export const getResultBySlug = (eventSlug: string): Record[] =>
  transformRecords(recordJson).filter((record) => record.slug === eventSlug);
