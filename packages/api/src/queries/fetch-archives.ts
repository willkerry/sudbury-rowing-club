import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";

const archiveFields = `
  _id,
  title,
  description,
  year,
  range,
  alt,
  "image": image.asset->{url, _id, metadata},
  location`;

const query = groq`*[_type == "archive"] | order(year asc){${archiveFields}}`;
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

const ZLocation = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ZArchive = z.object({
  title: z.string(),
  description: z.string().nullable(),
  year: z.string().nullable(),
  range: z.number().nullable(),
  alt: z.string().nullable(),
  image: ZImage,
  _id: z.string(),
  location: ZLocation.nullable(),
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
