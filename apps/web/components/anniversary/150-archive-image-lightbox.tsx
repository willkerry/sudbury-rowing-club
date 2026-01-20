"use client";

import { useToggle } from "@mantine/hooks";
import type { Archive } from "@sudburyrc/api";
import Image from "next/image";
import { LightBox } from "@/components/stour/lightbox";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const LONGEST_EDGE = 880;

const getDimensions = (aspectRatio: number) => {
  if (aspectRatio > 1) {
    return {
      width: LONGEST_EDGE,
      height: Math.round(LONGEST_EDGE / aspectRatio),
    };
  }

  return {
    width: Math.round(LONGEST_EDGE * aspectRatio),
    height: LONGEST_EDGE,
  };
};

export const ArchiveImage = ({
  image,
  alt,
}: {
  image: Archive["image"];
  alt: string;
}) => {
  const [open, toggle] = useToggle();

  const props = useSanityImageProps(image._id);

  const { width, height } = getDimensions(image.aspectRatio);

  if (!image.url) return null;

  return (
    <>
      <LightBox
        aspectRatio={image.aspectRatio}
        alt={alt}
        lqip={image.lqip}
        src={image.url}
        open={open}
        toggle={() => toggle()}
      />

      <button
        type="button"
        onClick={() => toggle()}
        aria-label="View full size"
      >
        <Image
          {...props}
          width={width}
          height={height}
          alt={alt}
          className="mx-auto my-4 rounded-sm shadow-sm"
        />
      </button>
    </>
  );
};
