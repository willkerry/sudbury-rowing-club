import {
  type UseNextSanityImageOptions,
  useNextSanityImage,
} from "next-sanity-image";
import { sanityClient } from "@sudburyrc/api";
import { type SanityImageSource } from "@sanity/image-url/lib/types/types";

export const useSanityImageProps = (
  imageId: SanityImageSource,
  options?: UseNextSanityImageOptions,
) => useNextSanityImage(sanityClient, imageId, options);
