import groq from "groq";
import { sanityClient } from "../sanity/client";
import { z } from "zod";

const archiveFields = `
  _id,
  title,
  description,
  year,
  range,
  alt,
  "image": image.asset->{url, _id, metadata}`;

const query = groq`*[_type == "archive"] | order(year desc){${archiveFields}}`;
const queryById = groq`*[_type == "archive" && _id == $id]{${archiveFields}}[0]`;

const ZPalette = z.object({
  foreground: z.string(),
  title: z.string(),
  population: z.number(),
  background: z.string(),
  _type: z.string(),
});

const ZPalettes = z.object({
  dominant: ZPalette,
  _type: z.string(),
  darkMuted: ZPalette,
  muted: ZPalette,
  lightVibrant: ZPalette,
  darkVibrant: ZPalette,
  lightMuted: ZPalette,
  vibrant: ZPalette,
});

const ZDimensions = z.object({
  height: z.number(),
  _type: z.string(),
  width: z.number(),
  aspectRatio: z.number(),
});

const ZMetadata = z.object({
  hasAlpha: z.boolean(),
  lqip: z.string(),
  dimensions: ZDimensions,
  isOpaque: z.boolean(),
  blurHash: z.string(),
  _type: z.string(),
  palette: ZPalettes,
});

const ZImage = z.object({
  url: z.string(),
  _id: z.string(),
  metadata: ZMetadata,
});

export const ZArchive = z.object({
  title: z.string(),
  description: z.string().nullable(),
  year: z.string().nullable(),
  range: z.number().nullable(),
  alt: z.string().nullable(),
  image: ZImage,
  _id: z.string(),
});
export type Archive = z.infer<typeof ZArchive>;

export const fetchArchives = async (): Promise<Archive[]> => {
  const response = await sanityClient.fetch(query);

  return z.array(ZArchive).parse(response);
};

export const fetchArchiveById = async (id: string): Promise<Archive> => {
  const response = await sanityClient.fetch(queryById, { id });

  return ZArchive.parse(response);
};
