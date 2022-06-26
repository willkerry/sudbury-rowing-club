import type { PicoSanity } from 'picosanity'

export const config: PicoSanity['clientConfig'] = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  apiVersion: "2021-03-25",
  useCdn: true,
};

export default config;
