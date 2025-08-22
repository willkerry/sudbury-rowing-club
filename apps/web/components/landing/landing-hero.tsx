"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

type Props = {
  imageId: string;
  imageAspectRatio: number;
  imageLqip: string;
  children?: React.ReactNode;
};

export const LandingHero = ({
  imageId,
  imageAspectRatio,
  imageLqip,
  children,
}: Props) => {
  const { data: Player, isSuccess } = useQuery({
    queryKey: ["player"],
    queryFn: () => dynamic(() => import("@/components/landing/player")),
    staleTime: "static",
  });

  return (
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
      {isSuccess && <Player />}
    </>
  );
};
