import { fetchOfficerNames } from "@sudburyrc/api";
import { getServerClient, OFFICERS_INDEX_NAME } from "@/lib/algolia";
import { createMetadata } from "@/lib/create-metadata";
import { CSRContactPage } from "./csr-page";

export const metadata = createMetadata({
  description: "Get in touch with the Sudbury Rowing Club",
  image: { title: "Contact Sudbury Rowing Club" },
  title: "Contact",
});

const fetchOfficersAndUpdateSearchIndex = async () => {
  const officers = await fetchOfficerNames();

  await getServerClient().replaceAllObjects({
    indexName: OFFICERS_INDEX_NAME,
    objects: officers.map((o) => ({ ...o, objectID: o._id })),
  });

  return officers;
};

const Contact = async () => {
  const officers = await fetchOfficersAndUpdateSearchIndex();

  return <CSRContactPage officers={officers} />;
};

export default Contact;
