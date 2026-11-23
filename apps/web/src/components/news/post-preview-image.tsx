"use client";

import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

export const PostPreviewImage = ({
  id,
  alt,
  lqip,
}: {
  id: string;
  alt: string;
  lqip: string;
}) => {
  const { src, loader } = useSanityImageProps(id);

  return (
    <Image
      alt={alt}
      blurDataURL={lqip}
      className="z-0 bg-linear-to-r from-gray-200 to-white object-cover"
      fill
      loader={loader}
      placeholder="blur"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 218px, 316px"
      src={src}
    />
  );
};
