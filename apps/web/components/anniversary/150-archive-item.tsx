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
    <figure id={_id} className="break-inside-avoid">
      <Link href={`/150/gallery/${_id}`} aria-label={`View ${title}`}>
        <div className="h-0.5" />

        <Image
          {...props}
          alt={alt || title || ""}
          width={IMAGE_WIDTH}
          height={imageHeight}
          className="rounded-sm shadow-sm"
        />

        <div className="h-7.5" />
      </Link>
    </figure>
  );
};
