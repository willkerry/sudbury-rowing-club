"use client";

import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

export const LandingHeroImage = ({
  imageId,
  imageAspectRatio,
  imageLqip,
}: {
  imageId: string;
  imageAspectRatio: number;
  imageLqip: string;
}) => (
  <Image
    {...useSanityImageProps(imageId)}
    alt="Aerial photograph of a Sudbury crew training."
    blurDataURL={imageLqip}
    height={992 / imageAspectRatio}
    placeholder="blur"
    priority
    width={992}
  />
);
