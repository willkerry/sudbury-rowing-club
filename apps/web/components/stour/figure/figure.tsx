import { cn } from "@/lib/utils";
import Image, { type ImageProps, type StaticImageData } from "next/image";
import { FigureWrapper } from "./figureWrapper";

export const WIDTH = 650;

export const Figure = ({
  imageProps: { className, ...imageProps },
  caption,
  ...rest
}: {
  imageProps: ImageProps;
  caption?: string;
} & React.ComponentPropsWithoutRef<"figure">) => {
  const src = getSrcString(imageProps.src);
  const { alt, blurDataURL, width, height } = imageProps;

  const maybeStaticImageData = getStaticImageData(imageProps.src);

  const probableWidth = maybeStaticImageData?.width || Number(width);
  const probableHeight = maybeStaticImageData?.height || Number(height);

  const hasCaption = caption?.trim();
  const imageClassName = cn(hasCaption && "mb-0", className);

  const willBeOptimised = isOptimisableImage(imageProps);

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
      {...rest}
    >
      {willBeOptimised ? (
        <Image
          sizes={`(max-width: ${WIDTH}px) 80vw, ${width}px`}
          className={imageClassName}
          {...imageProps}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className={imageClassName}
          width={width}
          height={height}
        />
      )}

      {hasCaption && <figcaption>{caption}</figcaption>}
    </FigureWrapper>
  );
};

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
  if (!src) return undefined;
  if (typeof src === "string") return undefined;

  if ("src" in src) return src;
  if ("default" in src) return src.default;

  return undefined;
}

function isOptimisableImage(imageProps: ImageProps): boolean {
  return (
    typeof imageProps.src !== "string" ||
    "fill" in imageProps ||
    ("width" in imageProps && "height" in imageProps)
  );
}
