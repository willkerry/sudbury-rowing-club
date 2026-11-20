import { sanityClient } from "@sudburyrc/api";
import {
  type UseNextSanityImageOptions,
  useNextSanityImage,
} from "next-sanity-image";

export const useSanityImageProps = (
  imageId: NonNullable<Parameters<typeof useNextSanityImage>[1]>,
  options?: UseNextSanityImageOptions,
) => useNextSanityImage(sanityClient, imageId, options);
