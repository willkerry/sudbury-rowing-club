"use client";

import type { SudburyImage } from "@sudburyrc/api";
import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const WIDTH = 635;

export const SectionImage = ({ image }: { image: SudburyImage }) => {
  const { src, loader } = useSanityImageProps(image._id);

  return (
    <Image
      alt={image.alt ?? ""}
      blurDataURL={image.lqip || undefined}
      className="rounded-sm shadow-sm"
      height={Math.round(WIDTH / image.aspectRatio)}
      loader={loader}
      placeholder={image.lqip ? "blur" : "empty"}
      sizes={`(max-width: 640px) 100vw, ${WIDTH}px`}
      src={src}
      width={WIDTH}
    />
  );
};
