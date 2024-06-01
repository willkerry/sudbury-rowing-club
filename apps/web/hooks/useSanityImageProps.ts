import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "@sudburyrc/api";
import {
  type UseNextSanityImageOptions,
  useNextSanityImage,
} from "next-sanity-image";

export const useSanityImageProps = (
  imageId: SanityImageSource,
  options?: UseNextSanityImageOptions,
) => useNextSanityImage(sanityClient, imageId, options);
