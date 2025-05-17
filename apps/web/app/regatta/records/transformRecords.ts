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

const RecordSchema = z.object({
  boat: z.string().transform(prettifyBoatnames),
  event: z.string().transform(prettifyBoatnames),
  year: z.string().transform((year) => new Date(year)),
  club: z.string(),
  name: z.string(),
  time: z.string().transform(parseDuration),
  round: z.union([z.literal("F"), z.literal("S"), z.literal("Q")]),
});

export type Record = z.infer<typeof RecordSchema>;

export const transformRecords = (records: typeof recordJson) =>
  RecordSchema.array().parse(records);

export const slugify = (event: string) => {
  // Replace boat class notation with full names
  const replacedEvent = event
    .replace(/8\+/g, "eight")
    .replace(/8[x×]/g, "octuple")
    .replace(/4\+/g, "coxed four")
    .replace(/4-/g, "coxless four")
    .replace(/4[x×]\+/g, "coxed quad")
    .replace(/4[x×]-/g, "coxless quad")
    .replace(/4[x×](?![\+-])/g, "quad")
    .replace(/2\+/g, "coxed pair")
    .replace(/2-/g, "pair")
    .replace(/2[x×]/g, "double")
    .replace(/1[x×]/g, "single");

  return slug(replacedEvent);
};

export const getSlugifiedRecords = (eventSlug?: string) => {
  if (!eventSlug) {
    return transformRecords(recordJson);
  }

  const untransformedRecords = recordJson.filter(
    (record) => slugify(prettifyBoatnames(record.event)) === eventSlug,
  );

  return transformRecords(untransformedRecords);
};
