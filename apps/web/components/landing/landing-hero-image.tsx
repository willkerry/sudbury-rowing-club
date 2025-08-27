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
    width={992}
    height={992 / imageAspectRatio}
    alt="Aerial photograph of a Sudbury crew training."
    quality={60}
    placeholder="blur"
    blurDataURL={imageLqip}
    priority
  />
);
