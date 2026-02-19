import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { type TypedObject, ZTypedObject } from "./typed-object";

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

const ZSafetyDocument = z.object({
  extension: z.string(),
  title: z.string(),
  url: z.string(),
});
type SafetyDocument = z.infer<typeof ZSafetyDocument>;

const ZSafetyLink = z.object({
  title: z.string(),
  url: z.string(),
});
type SafetyLink = z.infer<typeof ZSafetyLink>;

const ZPartialSafetyResponse = z.object({
  _id: z.string(),
  _updatedAt: z.coerce
    .date()
    .transform((date) => {
      if (date.toDateString() === new Date("2025-09-22").toDateString())
        return new Date("2025-01-30");

      return date;
    })
    .transform((date) => date.toDateString()),
  pin: z.boolean().nullable().default(false),
  title: z.string(),
});
const ZSafetyItem = ZPartialSafetyResponse.extend({
  body: z.array(ZTypedObject).nullable(),
  document: ZSafetyDocument.optional(),
  link: ZSafetyLink.optional(),
});

const fetchSafety = async (): Promise<SafetyItem[]> => {
  const response = await sanityClient.fetch(safetyQuery);

  return z.array(ZSafetyItem).parse(response);
};

const fetchSafetyById = async (id: string): Promise<SafetyItem | null> => {
  const response = await sanityClient.fetch(safetyQueryById, { id });

  return ZSafetyItem.nullable().parse(response);
};

interface SafetyItem extends z.infer<typeof ZPartialSafetyResponse> {
  body: TypedObject[] | null;
  document?: SafetyDocument;
  link?: SafetyLink;
}

export { fetchSafety, fetchSafetyById };
export type { SafetyItem };
