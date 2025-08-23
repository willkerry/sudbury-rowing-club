"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import { BoathouseDoor } from "./boathouse-door";

type Props = {
  imageId: string;
  imageAspectRatio: number;
  imageLqip: string;
  description: string;
};

export const LandingHero = ({
  imageId,
  imageAspectRatio,
  imageLqip,
  description,
}: Props) => {
  const { data: Player, isSuccess } = useQuery({
    queryKey: ["player"],
    queryFn: () => dynamic(() => import("@/components/landing/player")),
    staleTime: "static",
  });

  return (
    <div className="group relative flex overflow-hidden rounded-sm shadow-sm">
      <Image
        {...useSanityImageProps(imageId)}
        width={992}
        height={992 / imageAspectRatio}
        alt="Aerial photograph of a Sudbury crew training."
        quality={60}
        placeholder="blur"
        blurDataURL={imageLqip}
        priority
      />
      <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center gap-3 p-6 sm:gap-8 sm:p-12 md:gap-12 md:p-24 lg:gap-14">
        <BoathouseDoor aria-hidden className="z-10 w-full text-white" />
        <span className="z-10 rounded-full bg-white px-1 py-0.5 font-medium text-black text-xs mix-blend-screen shadow-sm backdrop-blur-sm sm:text-sm md:px-3 md:py-1 md:text-base">
          {description}
        </span>
      </div>
      {isSuccess && <Player />}
    </div>
  );
};
