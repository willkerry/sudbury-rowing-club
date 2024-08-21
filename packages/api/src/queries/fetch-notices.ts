import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { ZTypedObject } from "./typed-object";

const noticeFields = groq`
    _id,
    _updatedAt,
    _createdAt,
    title,
    "slug": slug.current,
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
    meta,
    documents[] {
        _key, 
        title, 
        documents[] {
            _key,
            title,
            "url": asset->url
        }
    } 
`;

const query = groq`*[_type == "members" && !(_id in path("drafts.**"))]| order(_updatedAt desc){${noticeFields}}`;
const queryForOne = groq`*[_type == "members" && !(_id in path("drafts.**")) && slug.current == $slug][0]{${noticeFields}}`;
const queryForSlugs = groq`*[_type == "members" && !(_id in path("drafts.**"))] | order(_updatedAt desc) { "slug": slug.current }`;

const ZNotice = z.object({
  _id: z.string(),
  _updatedAt: z.string().datetime(),
  _createdAt: z.string().datetime(),
  title: z.string(),
  slug: z.string(),
  body: z.array(ZTypedObject).nullable(),
  meta: z
    .array(
      z.object({
        _key: z.string(),
        label: z.string(),
        value: z.string(),
      }),
    )
    .nullable(),
  documents: z
    .array(
      z.object({
        _key: z.string(),
        title: z.string().nullable(),
        documents: z.array(
          z.object({
            _key: z.string(),
            title: z.string().nullable(),
            url: z.string().nullable(),
          }),
        ),
      }),
    )
    .nullable(),
});

const fetchNoticeSlugs = async () => {
  const response = await sanityClient.fetch(queryForSlugs);

  return z.array(z.object({ slug: z.string() })).parse(response);
};

const fetchNotices = async () => {
  const response = await sanityClient.fetch(query);

  return z.array(ZNotice).parse(response);
};

const fetchOneNotice = async (slug: string) => {
  const response = await sanityClient.fetch(queryForOne, { slug });

  return ZNotice.parse(response);
};

type Notice = z.infer<typeof ZNotice>;

export { fetchOneNotice, fetchNotices, fetchNoticeSlugs };

export type { Notice };
