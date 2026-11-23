"use client";

import type { Archive } from "@sudburyrc/api";
import Image from "next/image";
import Link from "next/link";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const IMAGE_WIDTH = 480;

export const ArchiveItem = ({ _id, alt, image, title }: Archive) => {
  const imageHeight = Math.round(IMAGE_WIDTH / (image?.aspectRatio || 1));

  const props = useSanityImageProps(image._id);

  return (
    <figure className="break-inside-avoid" id={_id}>
      <Link aria-label={`View ${title}`} href={`/150/gallery/${_id}`}>
        <div className="h-0.5" />

        <Image
          {...props}
          alt={alt || title || ""}
          className="rounded-sm shadow-sm"
          height={imageHeight}
          width={IMAGE_WIDTH}
        />

        <div className="h-7.5" />
      </Link>
    </figure>
  );
};
