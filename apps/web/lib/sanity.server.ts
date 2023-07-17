import PicoSanity from "picosanity";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  apiVersion: "2021-03-25",
  useCdn: true,
};

// Set up the client for fetching data in the getProps page functions
const sanityClient = new PicoSanity(config);

export default sanityClient;
