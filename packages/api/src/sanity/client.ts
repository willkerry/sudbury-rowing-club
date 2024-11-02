import { createClient, type ClientConfig } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export const getSanityConfig = () => {
  if (!projectId) throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  if (!dataset) throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");

  return {
    dataset: dataset || "production",
    projectId: projectId,
    apiVersion: "2021-03-25",
    useCdn: true,
  } satisfies ClientConfig;
};

export const sanityClient = createClient(getSanityConfig());
