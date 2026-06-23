"use client";

import { motion, useReducedMotion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useShuffledArray } from "@/hooks/useShuffledArray";
import { cn } from "@/lib/utils";
import type { SponsorLogo } from ".";

const SCALE_FACTOR = 0.5;
const BASE_WIDTH = 48;

const getLogoDimensions = (logo: StaticImageData) => {
  const aspectRatio = logo.width / logo.height;
  const width = aspectRatio ** SCALE_FACTOR * BASE_WIDTH;
  const height = width / aspectRatio;

  return { height: Math.round(height), width: Math.round(width) };
};

const useLogoDimensions = (logo: StaticImageData) =>
  useMemo(() => getLogoDimensions(logo), [logo]);

const LogoListItem = ({ logo: { logo, ...rest } }: { logo: SponsorLogo }) => {
  const { width, height } = useLogoDimensions(logo);

  const image = <Image alt="" height={height} src={logo.src} width={width} />;

  if (!rest.href) return image;

  return (
    <a
      aria-label={rest.name}
      className="opacity-70 transition duration-300 hover:-translate-y-0.5 hover:opacity-100"
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
  const [mounted, setMounted] = useState(false);
  const maybeShuffledLogos = useShuffledArray(logos, shuffle);
  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const containerClassName = cn(
    "flex flex-wrap items-center justify-center gap-10",
    className,
  );

  if (shuffle && !mounted)
    return (
      <div className={containerClassName}>
        {logos.map(({ logo }) => {
          const { width, height } = getLogoDimensions(logo);

          return <Skeleton key={logo.src} style={{ width, height }} />;
        })}
      </div>
    );

  return (
    <div className={containerClassName}>
      {maybeShuffledLogos?.map((logo, index) => (
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
          key={logo.logo.src}
          transition={{
            delay: Math.min(index, 6) * 0.08,
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
          }}
          viewport={{ margin: "0px 0px -10% 0px", once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <LogoListItem logo={logo} />
        </motion.div>
      ))}
    </div>
  );
};
