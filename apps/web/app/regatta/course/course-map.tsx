"use client";

import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

export const CourseMap = ({
  id,
  aspectRatio,
  lqip,
}: {
  id: string;
  aspectRatio: number;
  lqip: string;
}) => (
  <Image
    {...useSanityImageProps(id)}
    width={982}
    height={982 / aspectRatio}
    placeholder="blur"
    blurDataURL={lqip}
    alt="Sudbury Regatta course map showing the river layout, start and finish positions, and key landmarks"
  />
);
