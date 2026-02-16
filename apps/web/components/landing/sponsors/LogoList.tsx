"use client";

import Image, { type StaticImageData } from "next/image";
import { useMemo } from "react";
import { useShuffledArray } from "@/hooks/useShuffledArray";
import { cn } from "@/lib/utils";
import type { SponsorLogo } from ".";

const SCALE_FACTOR = 0.5;
const BASE_WIDTH = 48;

const useLogoDimensions = (logo: StaticImageData) =>
  useMemo(() => {
    const aspectRatio = logo.width / logo.height;
    const width = aspectRatio ** SCALE_FACTOR * BASE_WIDTH;
    const height = width / aspectRatio;

    return { width: Math.round(width), height: Math.round(height) };
  }, [logo.width, logo.height]);

const LogoListItem = ({ logo: { logo, ...rest } }: { logo: SponsorLogo }) => {
  const { width, height } = useLogoDimensions(logo);

  const image = <Image src={logo.src} alt="" width={width} height={height} />;

  if (!rest.href) return image;

  return (
    <a
      href={rest.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rest.name}
    >
      {image}
    </a>
  );
};

export const LogoList = ({
  logos,
  className,
  shuffle = false,
}: {
  logos: SponsorLogo[];
  className?: string;
  shuffle?: boolean;
}) => {
  const maybeShuffledLogos = useShuffledArray(logos, shuffle);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-10",
        className,
      )}
    >
      {maybeShuffledLogos?.map((logo) => (
        <LogoListItem key={logo.logo.src} logo={logo} />
      ))}
    </div>
  );
};
