"use client";

import React from "react";
import { useLightBox } from "@/components/stour/lightbox";

export const FigureWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    alt?: string;
    aspectRatio?: number;
    blurDataURL?: string;
    src: string;
  }
>(({ alt, aspectRatio, blurDataURL, src, children, ...rest }, ref) => {
  const { toggle, LightBox } = useLightBox({
    aspectRatio,
    src,
    lqip: blurDataURL,
    alt,
  });

  return (
    <>
      <LightBox />

      <figure {...rest} ref={ref}>
        <button
          type="button"
          onClick={() => toggle()}
          className="mx-auto block text-left hover:cursor-zoom-in"
          aria-label={`View the '${alt}' image in lightbox`}
        >
          {children}
        </button>
      </figure>
    </>
  );
});
