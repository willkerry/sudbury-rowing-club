"use client";

import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import Image from "next/image";

const CourseMap = ({
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
    alt=""
  />
);

export default CourseMap;
