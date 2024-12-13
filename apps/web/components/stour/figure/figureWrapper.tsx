"use client";

import { useLightBox } from "../lightbox";

export const FigureWrapper = ({
  alt,
  aspectRatio,
  blurDataURL,
  src,
  children,
}: {
  alt?: string;
  aspectRatio?: number;
  blurDataURL?: string;
  src: string;
  children: React.ReactNode;
}) => {
  const { toggle, LightBox } = useLightBox({
    aspectRatio,
    src,
    lqip: blurDataURL,
    alt,
  });

  return (
    <>
      <LightBox />

      <figure>
        <button
          type="button"
          onClick={() => toggle()}
          className="mx-auto block hover:cursor-zoom-in"
          aria-label={`View the '${alt}' image in lightbox`}
        >
          {children}
        </button>
      </figure>
    </>
  );
};
