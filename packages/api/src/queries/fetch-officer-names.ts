import groq from "groq";
import { z } from "zod";
import { sanityClient } from "../sanity/client";

const query = groq`*[_type == "officers" && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""] | order(orderRank){
  _id,
  "occupantId": occupant->_id,
  "name": occupant->firstName + " " + occupant->surname,
  role
}`;

const ZOfficerResponse = z.object({
  _id: z.string(),
  occupantId: z.string(),
  name: z.string(),
  role: z.string(),
});

const fetchOfficerNames = async () => {
  const response = await sanityClient.fetch(query);

  return z.array(ZOfficerResponse).parse(response);
};

type OfficerResponse = z.infer<typeof ZOfficerResponse>;

export { fetchOfficerNames };
export type { OfficerResponse };
