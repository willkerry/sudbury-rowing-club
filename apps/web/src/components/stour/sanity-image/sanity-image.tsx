"use client";

import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

type Props = {
  id: string;
  alt: string;
  aspectRatio: number;
  lqip?: string;
  width: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export const SanityImage = ({
  id,
  alt,
  aspectRatio,
  lqip,
  width,
  priority,
  className,
  sizes,
}: Props) => (
  <Image
    {...useSanityImageProps(id)}
    alt={alt}
    blurDataURL={lqip || undefined}
    className={className}
    height={Math.round(width / aspectRatio)}
    placeholder={lqip ? "blur" : "empty"}
    priority={priority}
    sizes={sizes}
    width={width}
  />
);
