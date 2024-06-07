"use client";

import Image from "next/image";
import Link from "next/link";
import { Archive } from "@sudburyrc/api";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const IMAGE_WIDTH = 480;

export const ArchiveItem = ({ _id, alt, image, title }: Archive) => {
  const imageHeight = Math.round(
    IMAGE_WIDTH / (image?.metadata.dimensions.aspectRatio || 1),
  );

  const props = useSanityImageProps(image._id);

  return (
    <figure id={_id} className="mb-8">
      <Link href={`/150/gallery/${_id}`} className="w-full">
        <Image
          {...props}
          alt={alt || title || ""}
          width={IMAGE_WIDTH}
          height={imageHeight}
          className="mx-auto rounded shadow"
        />
      </Link>
    </figure>
  );
};
