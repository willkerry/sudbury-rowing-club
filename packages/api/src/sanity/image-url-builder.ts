import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { getSanityConfig } from "./client";

export const urlFor = (source: SanityImageSource) => {
  const config = getSanityConfig();

  return createImageUrlBuilder(config).image(source);
};
