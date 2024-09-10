"use client";

import { shuffle as shuffleFn } from "radash";
import { cn } from "@/lib/utils";
import type { SponsorLogo } from ".";
import { useState } from "react";

const LogoListItem = ({ logo, href, name }: SponsorLogo) => (
  <li key={`${href}${name}`}>
    {href ? (
      <a
        href={href}
        aria-label={name}
        target="_blank"
        rel="noopener noreferrer"
      >
        {logo}
      </a>
    ) : (
      logo
    )}
  </li>
);

export const LogoList = ({
  logos,
  className,
  shuffle = false,
}: {
  logos: SponsorLogo[];
  className?: string;
  shuffle?: boolean;
}) => {
  const [maybeShuffledLogos] = useState(shuffle ? shuffleFn(logos) : logos);

  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-10 md:justify-between md:gap-4",
        className,
      )}
    >
      {maybeShuffledLogos.map((logo) => (
        <LogoListItem key={logo.name} {...logo} />
      ))}
    </ul>
  );
};
