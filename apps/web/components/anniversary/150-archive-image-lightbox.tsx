"use client";

import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import { useToggle } from "@mantine/hooks";
import type { Archive } from "@sudburyrc/api";
import Image from "next/image";
import LightBox from "../stour/lightbox";

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

  const { width, height } = getDimensions(
    image.metadata.dimensions.aspectRatio,
  );

  return (
    <>
      <LightBox
        aspectRatio={image.metadata.dimensions.aspectRatio}
        alt={alt}
        lqip={image.metadata.lqip}
        src={image.url}
        open={open}
        toggle={() => toggle()}
      />

      <button type="button" onClick={() => toggle()}>
        <Image
          {...props}
          width={width}
          height={height}
          alt={alt}
          className="mx-auto my-4 rounded shadow"
        />
      </button>
    </>
  );
};
