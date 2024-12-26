import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { IMAGE_FIELDS, Z_IMAGE_SCHEMA } from "../shared/image";
import { ZExcerpt, excerptFields } from "./fetch-news-article";
import { ZTypedObject } from "./typed-object";

const ZNoteSchema = z.object({
  display: z.boolean(),
  label: z.string(),
  text: z.string(),
  type: z.enum(["primary", "secondary", "success", "warning", "error"]),
});

const ZNewsSchema = z
  .object({
    date: z.string(),
    featuredImage: Z_IMAGE_SCHEMA.nullable(),
    _id: z.string(),
    slug: z.string(),
    title: z.string(),
  })
  .merge(ZExcerpt);

const ZHeroImageSchema = z.object({
  image: z.object({
    _id: z.string(),
    lqip: z.string(),
    aspectRatio: z.number(),
  }),
  youtubeId: z.string(),
  youtubeStartOffset: z.number(),
});

const ZLandingPageSubSchema = z.object({
  tagline: z.string(),
  title: z.string(),
  description: z.array(ZTypedObject),
  images: z.array(Z_IMAGE_SCHEMA),
  heroImage: ZHeroImageSchema,
  note: ZNoteSchema,
});

const ZLandingPageSchema = z.object({
  landingPage: ZLandingPageSubSchema,
  news: z.array(ZNewsSchema),
});

const query = groq`{
"landingPage": *[_id == "siteSettings" && !(_id in path("drafts.**"))][0].landingPage {
  description,
  images[] {
    caption, 
    "_id": asset->_id,
    "alt": asset->altText,
    "lqip": asset->metadata.lqip,
    "aspectRatio": asset->metadata.dimensions.aspectRatio,
    "background": asset->metadata.palette.muted.background,
    "foreground": asset->metadata.palette.muted.foreground,
    "url": asset->url
  },
  heroImage {
    image {
      "_id": asset->_id,
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
    }, 
    youtubeId,
    youtubeStartOffset
  },
  note,
  tagline,
  title,
},
"news": *[_type == "news" && !(_id in path("drafts.**"))] | order(date desc){
  _id,
  "slug": slug.current,
  title,
  ${excerptFields},
  date,
  featuredImage { ${IMAGE_FIELDS} },
}[0..3]}`;

export type LandingPage = z.infer<typeof ZLandingPageSchema>;

export const fetchLandingPage = async () => {
  const data = await sanityClient.fetch(query);
  return ZLandingPageSchema.parse(data);
};
