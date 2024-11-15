import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { z } from "zod";

const GetOfficerSchema = z.object({
  _id: z.string(),
  occupantID: z.string(),
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
          *[_id == $id && !(_id in path("drafts.**")) && vacant == false && defined(occupant->email)]{
            _id,
            "occupantID": occupant->_id,
            "name": occupant->firstName + " " + occupant->surname,
            "email": occupant->email,
            role
          }[0]
        `,
    { id },
  );

  if (!data)
    throw new Error(
      "Unable to retrieve contact details for the selected officer",
    );

  return GetOfficerSchema.parse(data);
}
