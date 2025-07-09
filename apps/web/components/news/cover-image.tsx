"use client";

import Image from "next/image";
import type { UseNextSanityImageBuilder } from "next-sanity-image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

type Props = {
  title: string;
  id: string;
  alt: string;
  blurDataURL?: string;
};

const imageBuilder: UseNextSanityImageBuilder = (builder, { width }) => {
  if (!width) return builder.fit("max");

  return builder
    .width(width)
    .height(Math.round(0.75 * width))
    .focalPoint(0.5, 0.382)
    .fit("crop")
    .crop("focalpoint");
};

export const CoverImage = ({ title, id, alt, blurDataURL }: Props) => {
  const { src, loader } = useSanityImageProps(id, { imageBuilder });

  return (
    <Image
      loader={loader}
      src={src}
      alt={alt || `Cover Image for ${title}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 455px, 651px"
      quality={60}
      fill
      placeholder="blur"
      blurDataURL={blurDataURL}
      className="object-cover"
    />
  );
};
