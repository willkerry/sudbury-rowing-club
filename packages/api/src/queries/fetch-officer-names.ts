import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";
import { OCCUPANT_NAMES } from "./officer-fragments";

const query = groq`*[_type == "officers" && !(_id in path("drafts.**")) && vacant != true && defined(email)] | order(orderRank){
  _id,
  "name": ${OCCUPANT_NAMES},
  role,
  description,
  "avatar": (occupants[0]->image).image.asset->{ _id, url, "lqip": metadata.lqip }
}`;

const ZOfficerResponse = z.object({
  _id: z.string(),
  avatar: z
    .object({
      _id: z.string(),
      lqip: z.string(),
      url: z.string(),
    })
    .nullable(),
  description: z.string().optional().nullable(),
  name: z.string().nullable(),
  role: z.string(),
});

const fetchOfficerNames = async () => {
  const response = await sanityClient.fetch(query);

  return z.array(ZOfficerResponse).parse(response);
};

type OfficerResponse = z.infer<typeof ZOfficerResponse>;

export type { OfficerResponse };
export { fetchOfficerNames };
