"use client";

import { motion, useReducedMotion } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useMemo, useState } from "react";
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

  if (shuffle && !mounted) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-10",
        className,
      )}
    >
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
