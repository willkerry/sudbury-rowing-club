import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { IMAGE_FIELDS, Z_IMAGE_SCHEMA } from "../shared/image";

const archiveFields = `
  _id,
  title,
  description,
  year,
  range,
  alt,
  "image": { ${IMAGE_FIELDS} },
  location`;

const query = groq`*[_type == "archive"] | order(year asc){${archiveFields}}`;
const queryById = groq`*[_type == "archive" && _id == $id]{${archiveFields}}[0]`;

const ZLocation = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ZArchive = z.object({
  _id: z.string(),
  alt: z.string().nullable(),
  description: z.string().nullable(),
  image: Z_IMAGE_SCHEMA,
  location: ZLocation.nullable(),
  range: z.number().nullable(),
  title: z.string(),
  year: z.string().nullable(),
});
export type Archive = z.infer<typeof ZArchive>;

export const fetchArchives = async (): Promise<Archive[]> => {
  const response = await sanityClient.fetch(query);

  return z.array(ZArchive).parse(response);
};

export const fetchArchiveById = async (id: string): Promise<Archive | null> => {
  const response = await sanityClient.fetch(queryById, { id });

  return ZArchive.nullable().parse(response);
};
