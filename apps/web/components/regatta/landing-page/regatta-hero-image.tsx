"use client";

import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import { ArrowUpIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

type Props = {
  title: string;
  subtitle: string;
  aspectRatio: number;
  src: string;
  blurDataURL?: string;
};

export const RegattaHeroImage = ({
  title,
  subtitle,
  aspectRatio,
  src,
  blurDataURL,
}: Props) => {
  const imageWidth = 984;
  const imageHeight = imageWidth / aspectRatio;
  return (
    <div className="relative flex overflow-hidden rounded-xl shadow-lg">
      <Image
        {...useSanityImageProps(src)}
        placeholder="blur"
        alt=""
        blurDataURL={blurDataURL}
        width={imageWidth}
        height={imageHeight}
      />
      <div className="absolute top-0 left-0 h-full w-full bg-linear-to-tr from-black via-transparent to-transparent" />
      <div className="absolute top-0 left-0 flex h-full w-full items-end p-6 md:p-12">
        <div className="hidden w-2/3 sm:block">
          <div className="max-w-sm font-bold text-4xl text-white leading-tighter drop-shadow-sm md:text-6xl">
            {title}
          </div>
          <div className="font-medium text-white opacity-75">
            <ArrowUpIcon aria-hidden className="mb-px inline-flex h-4 w-4" />{" "}
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};
