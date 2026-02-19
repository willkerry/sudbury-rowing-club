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

    return { height: Math.round(height), width: Math.round(width) };
  }, [logo.width, logo.height]);

const LogoListItem = ({ logo: { logo, ...rest } }: { logo: SponsorLogo }) => {
  const { width, height } = useLogoDimensions(logo);

  const image = <Image alt="" height={height} src={logo.src} width={width} />;

  if (!rest.href) return image;

  return (
    <a
      aria-label={rest.name}
      href={rest.href}
      rel="noopener noreferrer"
      target="_blank"
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
