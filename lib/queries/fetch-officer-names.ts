import groq from "groq";
import { z } from "zod";
import sanityClient from "../sanity.server";

const query = groq`*[_type == "officers" && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""] | order(orderRank){
    _id,
    name,
    role
}`;

const ZOfficerResponse = z.object({
  _id: z.string(),
  name: z.string(),
  role: z.string(),
});

const fetchOfficerNames = async () => {
  const response = await sanityClient.fetch(query);

  return z.array(ZOfficerResponse).parse(response);
};

type OfficerResponse = z.infer<typeof ZOfficerResponse>;

export default fetchOfficerNames;
export type { OfficerResponse };
