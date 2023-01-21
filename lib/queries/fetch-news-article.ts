import groq from "groq";
import { z } from "zod";
import sanityClient from "../sanity.server";
// @ts-ignore
import type { TypedObject } from "@portabletext/types";

export const postFields = groq`
    _id,
    "slug": slug.current,
    title,
    excerpt,
    date,
    author {"firstName": @->firstName, "surname": @->surname, "_id": @->_id},
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
    featuredImage {
        alt, 
        caption,
        "url": @.image.asset->url,
        "_id": @.image.asset->_id, 
        "lqip": @.image.asset->metadata.lqip, 
        "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio,
        "background": @.image.asset->metadata.palette.muted.background,
        "foreground": @.image.asset->metadata.palette.muted.foreground,
        "more": @.image.asset->metadata
    },
    
`;

const schemaForType =
  <T>() =>
  <S extends z.ZodType<T, any, any>>(arg: S) => {
    return arg;
  };

const baseTypedObjectZ = z
  .object({
    _type: z.string(),
    _key: z.string(),
  })
  .passthrough();

export const typedObjectZ = schemaForType<TypedObject>()(baseTypedObjectZ);

const ZArticle = z.object({
  _id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().nullable(),
  date: z.string(),
  author: z
    .object({
      firstName: z.string(),
      surname: z.string(),
      _id: z.string(),
    })
    .nullable(),
  body: z.array(typedObjectZ).nullable(),
  featuredImage: z
    .object({
      alt: z.string().nullable(),
      caption: z.string().nullable(),
      url: z.string().url(),
      _id: z.string(),
      lqip: z.string(),
      aspectRatio: z.number(),
      background: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .nullable(),
      foreground: z
        .string()
        .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .nullable(),
    })
    .nullable(),
});

const fetchOneArticle = async (slug: string) => {
  const query = groq`*[_type == "news" && slug.current == $slug][0] {
    ${postFields}
  }`;
  const article = await sanityClient.fetch(query, { slug });

  return ZArticle.parse(article);
};

export default fetchOneArticle;
export type Article = z.infer<typeof ZArticle>;
