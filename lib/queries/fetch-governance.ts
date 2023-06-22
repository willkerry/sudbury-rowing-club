import groq from "groq";
import { z } from "zod";
import sanityClient from "../sanity.server";

const ZNonExecOfficer = z.object({
  _id: z.string(),
  firstName: z.string(),
  surname: z.string(),
});

const ZDocument = z.object({
  _key: z.string(),
  name: z.string(),
  url: z.string().nullable(),
  file: z.string().nullable(),
  fileOrLink: z.string(),
});

export const ZOfficer = z.object({
  _id: z.string(),
  name: z.string().nullable(),
  role: z.string(),
  vacant: z.boolean(),
  description: z.string().nullable(),
  hasEmail: z.boolean(),
  image: z
    .object({
      _id: z.string(),
      lqip: z.string(),
    })
    .nullable(),
});

export const ZCommittee = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  members: z
    .array(
      z.object({
        _id: z.string(),
        role: z.string(),
        name: z.string().nullable(),
      })
    )
    .nullable(),
});

export const ZDocumentGroup = z.object({
  _key: z.string(),
  groupTitle: z.string(),
  resources: z.array(ZDocument),
});

export const ZGovernance = z.object({
  officers: z.array(ZOfficer),
  committees: z.array(ZCommittee),
  vicePresidents: z.array(ZNonExecOfficer),
  trustees: z.array(ZNonExecOfficer),
  documents: z.array(ZDocumentGroup),
});

const query = groq`{"officers": *[_type == "officers" && !(_id in path("drafts.**"))] | order(orderRank){
    _id,
    name,
    role,
    vacant,
    description,
    "hasEmail": email != null,
    "image": image.image {
        "_id": asset->_id,
        "lqip": asset->metadata.lqip,
    }
},
"committees": *[_type == "committees" && !(_id in path("drafts.**"))] | order(title desc){
    _id,
    title,
    description,
    members[]-> {_id, role, name}
},
"vicePresidents": *[_type == "vicePresidents" && !(_id in path("drafts.**"))] | order(surname asc, firstName asc){
    _id,
    firstName,
    surname
},
"trustees": *[_type == "trustees" && !(_id in path("drafts.**"))] | order(surname asc, firstName asc){
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
        fileOrLink
    }
}}`;

export type Governance = z.infer<typeof ZGovernance>;

export const fetchGovernance = async () => {
  const data = await sanityClient.fetch(query);
  return ZGovernance.parse(data);
};

export default fetchGovernance;
