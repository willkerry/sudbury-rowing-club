import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { z } from "zod";

const GetOfficerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.string(),
});

export default async function getOfficer(id: string) {
  if (!id) {
    throw new Error("No officer ID supplied");
  }
  const data = await sanityClient.fetch(
    groq`
          *[_id == $id && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""]{
            name,
            email,
            role
          }[0]
        `,
    { id }
  );

  return GetOfficerSchema.parse(data);
}
