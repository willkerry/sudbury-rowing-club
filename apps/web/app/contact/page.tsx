import { fetchOfficerNames } from "@sudburyrc/api";
import { serverIndexOfficers } from "@/lib/algolia";
import { createMetadata } from "@/lib/create-metadata";
import { CSRContactPage } from "./csr-page";

export const metadata = createMetadata({
  title: "Contact",
  description: "Get in touch with the Sudbury Rowing Club",
  image: { title: "Contact Sudbury Rowing Club" },
});

const fetchOfficersAndUpdateSearchIndex = async () => {
  const officers = await fetchOfficerNames();

  serverIndexOfficers.replaceAllObjects(
    officers.map((o) => ({ ...o, objectID: o._id })),
  );

  return officers;
};

const Contact = async () => {
  const officers = await fetchOfficersAndUpdateSearchIndex();

  return <CSRContactPage officers={officers} />;
};

export default Contact;
