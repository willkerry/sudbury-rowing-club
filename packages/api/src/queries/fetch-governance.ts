import groq from "groq";
import { z } from "zod";
import { sanityFetch } from "../sanity/client";
import { OCCUPANT_NAMES } from "./officer-fragments";

const ZNonExecOfficer = z.object({
  _id: z.string(),
  firstName: z.string(),
  surname: z.string(),
});

const ZDocument = z.object({
  _key: z.string(),
  file: z.string().nullable(),
  fileOrLink: z.string(),
  mimeType: z.string().nullable(),
  name: z.string(),
  /** in bytes */
  size: z.number().nullable(),
  url: z.string().nullable(),
});

const ZOfficer = z.object({
  _id: z.string(),
  description: z.string().nullable(),
  hasEmail: z.boolean(),
  image: z
    .object({
      _id: z.string(),
      lqip: z.string(),
    })
    .nullable(),
  name: z.string().nullable(),
  role: z.string(),
  vacant: z.boolean(),
});

const ZCommittee = z.object({
  _id: z.string(),
  description: z.string(),
  members: z
    .array(
      z.object({
        _id: z.string(),
        name: z.string().nullable(),
        role: z.string(),
      }),
    )
    .nullable(),
  title: z.string(),
});

const ZDocumentGroup = z.object({
  _key: z.string(),
  groupTitle: z.string(),
  resources: z.array(ZDocument),
});

const ZGovernance = z.object({
  committees: z.array(ZCommittee),
  documents: z.array(ZDocumentGroup),
  officers: z.array(ZOfficer),
  trustees: z.array(ZNonExecOfficer),
  vicePresidents: z.array(ZNonExecOfficer),
});

const query = groq`{
"officers": *[_type == "officers"] | order(orderRank){
  _id,
  "name": ${OCCUPANT_NAMES},
  role,
  vacant,
  description,
  "hasEmail": defined(email),
  "image": occupants[0]->image.image {
      "_id": asset->_id,
      "lqip": asset->metadata.lqip,
  }
},
"committees": *[_type == "committees"] | order(title desc){
  _id,
  title,
  description,
  members[]-> {
    _id,
    role,
    "name": ${OCCUPANT_NAMES},
  }
},
"vicePresidents": *[_type == "vicePresidents"] | order(reference->surname asc, reference->firstName asc).reference->{
  _id,
  firstName,
  surname
},
"trustees": *[_type == "trustees"] | order(reference->surname asc, reference->firstName asc).reference->{
  _id,
  firstName,
  surname
},
"documents": *[_id == "siteSettings"][0].governanceResources[] {
  _key,
  groupTitle,
  resources[] {
      _key,
      name,
      url,
      "file": file.asset->url,
      "mimeType": file.asset->mimeType,
      "size": file.asset->size,
      fileOrLink
  }
}}`;

export type Governance = z.infer<typeof ZGovernance>;

export const fetchGovernance = async () =>
  sanityFetch(query, ZGovernance.parse);
