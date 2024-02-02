import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { ZTypedObject } from "./typed-object";

const articleFields = groq`
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
  },
`;

const articleSummaryFields = groq`
  _id,
  "slug": slug.current,
  title,
  excerpt,
  date,
  featuredImage {
    alt,
    caption,
    "url": @.image.asset->url,
    "_id": @.image.asset->_id,
    "lqip": @.image.asset->metadata.lqip,
    "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio,
    "background": @.image.asset->metadata.palette.muted.background,
    "foreground": @.image.asset->metadata.palette.muted.foreground,
  },
`;

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
  body: z.array(ZTypedObject).nullable(),
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

export const ZArticleSummary = ZArticle.omit({
  body: true,
  author: true,
});

const ZArticleCount = z.number();

const fetchOneArticle = async (slug: string) => {
  const query = groq`*[_type == "news" && slug.current == $slug][0] {
    ${articleFields}
  }`;
  const article = await sanityClient.fetch(query, { slug });

  return ZArticle.parse(article);
};

const fetchNArticles = async (first: number, last: number) => {
  const query = groq`*[_type == "news"] | order(date desc) {
    ${articleSummaryFields}
  }[$first...$last]`;
  const articles = await sanityClient.fetch(query, { first, last });

  return z.array(ZArticleSummary).parse(articles);
};

const fetchArticleCount = async () => {
  const query = groq`count(*[_type == "news" && !(_id in path("drafts.**"))])`;
  const count = await sanityClient.fetch(query);

  return ZArticleCount.parse(count);
};

const fetchAllSlugs = async () => {
  const query = groq`*[_type == "news" && defined(slug.current)][].slug.current`;

  return z.array(z.string()).parse(await sanityClient.fetch(query));
};

const fetchAllArticles = async () => {
  const query = groq`*[_type == "news" && !(_id in path("drafts.**"))] | order(date desc) {
    ${articleFields}
  }`;
  const articles = await sanityClient.fetch(query);

  return z.array(ZArticle).parse(articles);
};

export {
  fetchOneArticle,
  fetchNArticles,
  fetchAllArticles,
  fetchArticleCount,
  fetchAllSlugs,
};
export type Article = z.infer<typeof ZArticle>;
export type ArticleSummary = z.infer<typeof ZArticleSummary>;
