"use client";

import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import { Figure, WIDTH } from "./figure";

type FigureProps = {
  _id?: string;
  _key?: string;
  caption: string;
  image: string;
  alt: string;
  /** @deprecated */
  altText?: string;
  lqip: string;
  aspectRatio: number;
  description: string;
};

type Orientation = "landscape" | "portrait" | "square";

const getOrientation = (aspectRatio: number): Orientation => {
  if (aspectRatio < 1.1 && aspectRatio > 0.9) {
    return "square";
  }

  if (aspectRatio > 1) return "landscape";
  return "portrait";
};

const ORIENTATION_WIDTH_MODIFIERS: Record<Orientation, number> = {
  landscape: 1,
  portrait: 0.6,
  square: 1,
};

export const SanityFigure = ({
  value: {
    caption,
    image,
    alt: newAlt,
    altText,
    lqip,
    aspectRatio,
    description,
  },
}: {
  value: FigureProps;
}) => {
  const orientation = getOrientation(aspectRatio);

  const alt = newAlt || altText || caption;
  const captionText = caption || description || "";
  const width = Math.round(WIDTH * ORIENTATION_WIDTH_MODIFIERS[orientation]);
  const height = Math.round(width / aspectRatio);

  return (
    <Figure
      imageProps={{
        ...useSanityImageProps(image),
        alt,
        width,
        height,
        placeholder: "blur",
        blurDataURL: lqip,
      }}
      caption={captionText}
    />
  );
};
