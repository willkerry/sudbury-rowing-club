"use client";

import type { Archive } from "@sudburyrc/api";
import Image from "next/image";
import { LightBox, LightBoxTrigger } from "@/components/stour/lightbox";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const LONGEST_EDGE = 880;

const getDimensions = (aspectRatio: number) => {
  if (aspectRatio > 1) {
    return {
      height: Math.round(LONGEST_EDGE / aspectRatio),
      width: LONGEST_EDGE,
    };
  }

  return {
    height: LONGEST_EDGE,
    width: Math.round(LONGEST_EDGE * aspectRatio),
  };
};

export const ArchiveImage = ({
  image,
  alt,
}: {
  image: Archive["image"];
  alt: string;
}) => {
  const props = useSanityImageProps(image._id);
  const { width, height } = getDimensions(image.aspectRatio);

  if (!image.url) return null;

  return (
    <LightBox
      alt={alt}
      aspectRatio={image.aspectRatio}
      lqip={image.lqip}
      src={image.url}
    >
      <LightBoxTrigger aria-label="View full size">
        <Image
          {...props}
          alt={alt}
          className="mx-auto my-4 rounded-sm shadow-sm"
          height={height}
          width={width}
        />
      </LightBoxTrigger>
    </LightBox>
  );
};
