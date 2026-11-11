import { OCCUPANT_NAMES, sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { z } from "zod";

const GetOfficerSchema = z.object({
  _id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  role: z.string(),
});

export const getOfficer = async (id: string) => {
  if (!id) {
    throw new Error("No officer ID supplied");
  }
  const data = await sanityClient.fetch(
    groq`
          *[_id == $id && _type == "officers" && !(_id in path("drafts.**")) && vacant != true && defined(email)]{
            _id,
            "name": ${OCCUPANT_NAMES},
            email,
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
};
