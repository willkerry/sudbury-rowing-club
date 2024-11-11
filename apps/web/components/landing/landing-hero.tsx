"use client";

import BoathouseDoor from "@/components/landing/boathouse-door";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import dynamic from "next/dynamic";
import Image from "next/image";
import Container from "../layouts/container";

const Player = dynamic(() => import("@/components/landing/player"));

type Props = {
  imageId: string;
  imageAspectRatio: number;
  imageLqip: string;
  slogan: string;
};

const LandingHero = ({
  imageId,
  imageAspectRatio,
  imageLqip,
  slogan,
}: Props) => (
  <Container>
    <div className="group relative flex overflow-hidden rounded shadow">
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
        <span className="z-10 rounded-full bg-white px-1 py-0.5 text-xs font-medium text-black mix-blend-screen shadow backdrop-blur sm:text-sm md:px-3 md:py-1 md:text-base">
          {slogan}
        </span>
      </div>
      <Player />
    </div>
  </Container>
);
export default LandingHero;
