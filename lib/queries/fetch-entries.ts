import groq from "groq";
import { z } from "zod";
import sanityClient from "../sanity.server";
import { ZTypedObject } from "./typed-object";

const entriesQuery = groq`*[_type == "regattaSettings"][0]{entries, events}`;

const ZEvent = z.object({
  _key: z.string(),
  boatClasses: z.array(z.string()),
  categories: z.string(),
  description: z.string(),
  course: z.string(),
  gender: z.string(),
  prizes: z.string(),
  title: z.string(),
});

const ZRow = z.object({
  _key: z.string(),
  _type: z.literal("tableRow"),
  cells: z.array(z.string()),
});

const ZTable = z
  .object({
    rows: z.array(ZRow).default([]),
  })
  .nullable();

const ZEntriesResponse = z.object({
  entries: z.object({
    description: z.array(ZTypedObject).nullable(),
    waveNames: z.array(z.string()).default([]),
    waves: ZTable,
    wavesCaption: z.string().default(""),
  }),
  events: z.object({
    events: z.array(ZEvent),
  }),
});

const fetchEntries = async () => {
  const response = await sanityClient.fetch(entriesQuery);

  return ZEntriesResponse.parse(response);
};

type EntriesResponse = z.infer<typeof ZEntriesResponse>;
type Event = z.infer<typeof ZEvent>;

export default fetchEntries;
export type { EntriesResponse, Event };
