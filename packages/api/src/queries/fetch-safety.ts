import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { ZTypedObject } from "./typed-object";

const fields = groq`
_updatedAt,
_id,
title,
pin,
body[]{
    ...,
    _type == "figure" => {
    "_id": @.image.asset->_id,
    "altText": @.image.asset->altText,
    "description": @.image.asset->description,
    "lqip": @.image.asset->metadata.lqip,
    "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio, 
    },
},
document != null => {
    document {
    title,
    "url": asset->url,
    "extension": asset->extension,
    },
},
link != null => { link }`;

const safetyQuery = groq`*[
    _type == "safety" &&
    !(_id in path("drafts.**"))
  ] | order(_updatedAt asc) {
  ${fields}
}`;

const safetyQueryById = groq`*[_id == $id][0]{${fields}}`;

const ZSafetyResponse = z.object({
  _updatedAt: z.coerce
    .date()
    .transform((date) => {
      if (date.toDateString() === new Date("2025-09-22").toDateString())
        return new Date("2025-01-30");

      return date;
    })
    .transform((date) => date.toDateString()),
  _id: z.string(),
  title: z.string(),
  body: z.array(ZTypedObject).nullable(),
  pin: z.boolean().nullable().default(false),
  document: z
    .object({
      title: z.string(),
      url: z.string(),
      extension: z.string(),
    })
    .optional(),
  link: z
    .object({
      title: z.string(),
      url: z.string(),
    })
    .optional(),
});

const fetchSafety = async () => {
  const response = await sanityClient.fetch(safetyQuery);

  return z.array(ZSafetyResponse).parse(response);
};

const fetchSafetyById = async (id: string) => {
  const response = await sanityClient.fetch(safetyQueryById, { id });

  return ZSafetyResponse.nullable().parse(response);
};

type SafetyResponse = z.infer<typeof ZSafetyResponse>;

export { fetchSafety, fetchSafetyById };
export type { SafetyResponse };
