import groq from "groq";
import { z } from "zod";
import { sanityFetch } from "../sanity/client";
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

const query = groq`*[_type == "members"]| order(_updatedAt desc){${noticeFields}}`;
const queryForOne = groq`*[_type == "members" && slug.current == $slug][0]{${noticeFields}}`;
const queryForSlugs = groq`*[_type == "members"] | order(_updatedAt desc) { "slug": slug.current }`;

const ZNotice = z.object({
  _createdAt: z.string().datetime(),
  _id: z.string(),
  _updatedAt: z.string().datetime(),
  body: z.array(ZTypedObject).nullable(),
  documents: z
    .array(
      z.object({
        _key: z.string(),
        documents: z.array(
          z.object({
            _key: z.string(),
            title: z.string().nullable(),
            url: z.string().nullable(),
          }),
        ),
        title: z.string().nullable(),
      }),
    )
    .nullable(),
  meta: z
    .array(
      z.object({
        _key: z.string(),
        label: z.string(),
        value: z.string(),
      }),
    )
    .nullable(),
  slug: z.string(),
  title: z.string(),
});

const fetchNoticeSlugs = async () =>
  sanityFetch(queryForSlugs, z.array(z.object({ slug: z.string() })).parse);

const fetchNotices = async () => sanityFetch(query, z.array(ZNotice).parse);

const fetchOneNotice = async (slug: string) =>
  sanityFetch(queryForOne, ZNotice.nullable().parse, { slug });

type Notice = z.infer<typeof ZNotice>;

export type { Notice };
export { fetchNoticeSlugs, fetchNotices, fetchOneNotice };
