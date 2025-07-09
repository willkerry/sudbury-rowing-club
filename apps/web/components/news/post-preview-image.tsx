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
      loader={loader}
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL={lqip}
      fill
      quality={60}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 218px, 316px"
      className="z-0 bg-linear-to-r from-gray-200 to-white object-cover"
    />
  );
};
