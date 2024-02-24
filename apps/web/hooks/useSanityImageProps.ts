import {
  UseNextSanityImageOptions,
  useNextSanityImage,
} from "next-sanity-image";
import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "@sudburyrc/api";

export const useSanityImageProps = (
  imageId: SanityImageSource,
  options?: UseNextSanityImageOptions,
) => useNextSanityImage(sanityClient, imageId, options);
