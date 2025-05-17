"use client";

import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import dynamic from "next/dynamic";
import Image from "next/image";

const Player = dynamic(() => import("@/components/landing/player"));

type Props = {
  imageId: string;
  imageAspectRatio: number;
  imageLqip: string;
  children?: React.ReactNode;
};

const LandingHero = ({
  imageId,
  imageAspectRatio,
  imageLqip,
  children,
}: Props) => (
  <>
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
    {children}
    <Player />
  </>
);
export default LandingHero;
