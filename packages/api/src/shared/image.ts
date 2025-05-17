import groq from "groq";
import { z } from "zod";

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

export const NESTED_IMAGE_FIELDS = groq`
  alt,
  caption,
  "_id": asset->_id,
  "lqip": asset->metadata.lqip,
  "aspectRatio": asset->metadata.dimensions.aspectRatio,
  "background": asset->metadata.palette.muted.background,
  "foreground": asset->metadata.palette.muted.foreground,
  "url": asset->url
`;

export const Z_IMAGE_SCHEMA = z.object({
  alt: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  url: z
    .string()
    .url()
    .nullable()
    .optional()
    .transform((v) => v || undefined),
  _id: z.string(),
  lqip: z
    .string()
    .nullable()
    .optional()
    .transform((v) => v || ""),
  aspectRatio: z
    .number()
    .nullable()
    .optional()
    .transform((v) => v || 1),
  background: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .nullable()
    .optional()
    .transform((v) => v || undefined),
  foreground: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .nullable()
    .optional()
    .transform((v) => v || undefined),
});

export type SudburyImage = z.infer<typeof Z_IMAGE_SCHEMA>;
