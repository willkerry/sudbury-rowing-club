import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { NESTED_IMAGE_FIELDS, Z_IMAGE_SCHEMA } from "../shared/image";
import { ZTypedObject } from "./typed-object";

const regattaSettingsQuery = groq`
    *[_type == "regattaSettings"][0] {
        title,
        date,
        competitorInformation {
            description,
            documents[] { 
                title, 
                "extension": asset->extension,
                "url": asset->url,
                "_id": asset->_id
            },
        },
        entries,
        "events": events.events,
        landingPage {
            description,
            heroImage {
                heading,
                subheading,
                image { ${NESTED_IMAGE_FIELDS} }
            },
            images[] {
              ${NESTED_IMAGE_FIELDS}
            },
            tagline
        },
        results,
    }
`;

const ZHeroImage = z.object({
  heading: z.string(),
  subheading: z.string(),
  image: Z_IMAGE_SCHEMA,
});

const ZDocument = z.object({
  _id: z.string(),
  title: z.string(),
  extension: z.string(),
  url: z.string(),
});

const ZCompetitorInformation = z.object({
  description: z.string(),
  documents: z.array(ZDocument).nullable(),
});

const ZEvent = z.object({
  _key: z.string(),
  boatClasses: z.array(z.string()),
  categories: z.string(),
  description: z.string(),
  course: z.string(),
  gender: z.string(),
  prizes: z.string(),
  title: z.string(),
});

const ZRow = z.object({
  _key: z.string(),
  _type: z.literal("tableRow"),
  cells: z.array(z.string()),
});

const ZTable = z
  .object({
    rows: z.array(ZRow).default([]),
  })
  .nullable();

const ZEntries = z.object({
  description: z.array(ZTypedObject).nullable(),
  waveNames: z.array(z.string()).default([]),
  waves: ZTable,
  wavesCaption: z.string().default(""),
});

const ZLandingPage = z.object({
  description: z.array(ZTypedObject).nullable(),
  heroImage: ZHeroImage,
  images: z.array(Z_IMAGE_SCHEMA),
  tagline: z.string(),
});

const ZResults = z.object({
  description: z.array(ZTypedObject).nullable(),
  records: z.string().default(""),
});

const ZRegattaSettings = z.object({
  title: z.string(),
  date: z.string(),
  competitorInformation: ZCompetitorInformation,
  entries: ZEntries,
  events: z.array(ZEvent),
  landingPage: ZLandingPage,
  results: ZResults,
});

const fetchRegattaSettings = async () =>
  ZRegattaSettings.parse(await sanityClient.fetch(regattaSettingsQuery));

type RegattaSettings = z.infer<typeof ZRegattaSettings>;

export { fetchRegattaSettings };
export type { RegattaSettings };
