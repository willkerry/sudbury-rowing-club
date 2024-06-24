"use client";

import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

type Props = {
  title: string;
  id: string;
  alt: string;
  blurDataURL?: string;
};

const CoverImage = ({ title, id, alt, blurDataURL }: Props) => {
  const { src, loader } = useSanityImageProps(id);

  return (
    <Image
      loader={loader}
      src={src}
      alt={alt || `Cover Image for ${title}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 455px, 651px"
      quality={20}
      fill
      placeholder="blur"
      blurDataURL={blurDataURL}
      className="object-cover"
    />
  );
};

export default CoverImage;
