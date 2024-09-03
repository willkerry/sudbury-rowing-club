import { z } from "zod";
import groq from "groq";

export const IMAGE_FIELDS = groq`
  alt,
  caption,
  "_id": @.image.asset->_id,
  "lqip": @.image.asset->metadata.lqip,
  "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio,
  "background": @.image.asset->metadata.palette.muted.background,
  "foreground": @.image.asset->metadata.palette.muted.foreground,
  "url": @.image.asset->url
`;

export const Z_IMAGE_SCHEMA = z.object({
  alt: z
    .string()
    .nullable()
    .transform((v) => v || undefined),
  caption: z
    .string()
    .nullable()
    .transform((v) => v || undefined),
  url: z.string().url(),
  _id: z.string(),
  lqip: z.string(),
  aspectRatio: z.number(),
  background: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .nullable()
    .transform((v) => v || undefined),
  foreground: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .nullable()
    .transform((v) => v || undefined),
});
