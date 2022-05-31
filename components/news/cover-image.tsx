import Image from "next/image";

type Props = {
  title: string;
  src: string;
  alt: string;
  height: number;
  width: number;
  blurDataURL?: string;
};

const CoverImage = ({ title, src, alt, height, width, blurDataURL }: Props) => (
  <Image
    src={src}
    alt={alt || `Cover Image for ${title}`}
    width={width}
    height={height}
    placeholder="blur"
    blurDataURL={blurDataURL}
  />
);

export default CoverImage;