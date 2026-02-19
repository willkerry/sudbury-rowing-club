import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";

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
  occupantId: z.string().nullable(),
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
        occupantId: z.string().nullable(),
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
"officers": *[_type == "officers" && !(_id in path("drafts.**"))] | order(orderRank){
  _id,
  "occupantId": occupant->_id,
  "name": occupant->firstName + " " + occupant->surname,
  role,
  vacant,
  description,
  "hasEmail": defined(occupant->email),
  "image": occupant->image.image {
      "_id": asset->_id,
      "lqip": asset->metadata.lqip,
  }
},
"committees": *[_type == "committees" && !(_id in path("drafts.**"))] | order(title desc){
  _id,
  title,
  description,
  members[]-> {
    _id, 
    "occupantId": occupant->_id,
    role, 
    "name": occupant->firstName + " " + occupant->surname,
  }
},
"vicePresidents": *[_type == "vicePresidents" && !(_id in path("drafts.**"))] | order(reference->surname asc, reference->firstName asc).reference->{
  _id,
  firstName,
  surname
},
"trustees": *[_type == "trustees" && !(_id in path("drafts.**"))] | order(reference->surname asc, reference->firstName asc).reference->{
  _id,
  firstName,
  surname
},
"documents": *[_id == "siteSettings" && !(_id in path("drafts.**"))][0].governanceResources[] {
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

export const fetchGovernance = async () => {
  const data = await sanityClient.fetch(query);
  return ZGovernance.parse(data);
};
