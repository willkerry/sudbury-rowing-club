import sanityClient from "@/lib/sanity.server";
import groq from "groq";

export default async function getOfficer(id: string) {
  if (!id) {
    throw new Error("No officer ID supplied");
  }
  const data = await sanityClient.fetch(
    groq`
          *[_id == $id && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""] | order(order asc){
            name,
            email
          }
        `,
    { id }
  );
  if (data.length === 0) {
    throw new Error("No officer found with that ID");
  } else if (data.length > 1) {
    throw new Error("Multiple officers found with that ID");
  }
  const result = {
    name: data[0].name,
    email: data[0].email,
  };
  return result;
}
