import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { ZTypedObject } from "./typed-object";

const safetyQuery = groq`*[_type == "safety" && !(_id in path("drafts.**"))] | order(_updatedAt asc){
_updatedAt,
_id,
title,
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
link != null => { link },
}`;

const ZSafetyResponse = z.object({
  _updatedAt: z.string(),
  _id: z.string(),
  title: z.string(),
  body: z.array(ZTypedObject).nullable(),
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

type SafetyResponse = z.infer<typeof ZSafetyResponse>;

export { fetchSafety };
export type { SafetyResponse };
