import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { getSanityConfig } from "./client";

export const urlFor = (source: SanityImageSource) => {
  const config = getSanityConfig();

  return imageUrlBuilder(config).image(source);
};
