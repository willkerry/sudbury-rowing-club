import Image, { type ImageProps, type StaticImageData } from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { FigureWrapper } from "./figureWrapper";

export const WIDTH = 650;

export const Figure = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    imageProps: ImageProps;
    caption?: React.ReactNode;
  }
>(({ imageProps, caption, ...props }, ref) => {
  const src = getSrcString(imageProps.src);
  const { alt, blurDataURL, width, height } = imageProps;

  const maybeStaticImageData = getStaticImageData(imageProps.src);

  const probableWidth = maybeStaticImageData?.width || Number(width);
  const probableHeight = maybeStaticImageData?.height || Number(height);

  const willBeOptimised = isOptimisableImage(imageProps);
  const hasCaption = !!caption;

  return (
    <FigureWrapper
      src={src}
      alt={alt}
      aspectRatio={
        width && height
          ? Number(width) / Number(height)
          : probableWidth / probableHeight
      }
      blurDataURL={blurDataURL}
      {...props}
      ref={ref}
    >
      {willBeOptimised ? (
        <Image
          sizes={`(max-width: ${WIDTH}px) 80vw, ${width}px`}
          className={cn(hasCaption && "mb-0", imageProps.className)}
          {...imageProps}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(hasCaption && "mb-0", imageProps.className)}
          width={width}
          height={height}
        />
      )}

      {caption && <figcaption>{caption}</figcaption>}
    </FigureWrapper>
  );
});

function getSrcString(src: ImageProps["src"]): string {
  if (!src) return "";

  if (typeof src === "string") return src;
  if ("src" in src) return src.src;
  if ("default" in src) return src.default.src;

  return "";
}

function getStaticImageData(
  src: ImageProps["src"],
): StaticImageData | undefined {
  if (!src) return;
  if (typeof src === "string") return;

  if ("src" in src) return src;
  if ("default" in src) return src.default;

  return;
}

function isOptimisableImage(imageProps: ImageProps): boolean {
  return (
    typeof imageProps.src !== "string" ||
    "fill" in imageProps ||
    ("width" in imageProps && "height" in imageProps)
  );
}
