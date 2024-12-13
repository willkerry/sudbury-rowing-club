import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import { FigureWrapper } from "./figureWrapper";

export const WIDTH = 650;

export const Figure = ({
  imageProps,
  caption,
  src,
}: {
  imageProps: ImageProps;
  caption?: string;
  src?: string;
}) => (
  <FigureWrapper
    src={src || ""}
    alt={imageProps.alt}
    aspectRatio={
      imageProps.width && imageProps.height
        ? Number(imageProps.width) / Number(imageProps.height)
        : 1
    }
    blurDataURL={imageProps.blurDataURL}
  >
    <Image
      sizes={`(max-width: ${WIDTH}px) 80vw, ${imageProps.width}px`}
      className={cn(!!caption && "mb-0")}
      {...imageProps}
    />
    {caption !== null && <figcaption>{caption}</figcaption>}
  </FigureWrapper>
);
