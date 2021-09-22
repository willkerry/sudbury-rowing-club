import Image from "next/image";

export default function CoverImage({
  title,
  src,
  alt,
  height,
  width,
  blurDataURL,
}) {
  const image = (
    <Image
      src={src}
      alt={alt ? alt : `Cover Image for ${title}`}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );
  return image;
}
