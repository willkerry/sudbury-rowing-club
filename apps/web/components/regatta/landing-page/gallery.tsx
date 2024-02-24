import Image from "next/image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

type ImageType = {
  _id: string;
  caption?: string;
  lqip?: string;
  aspectRatio: number;
};

const GalleryFigure = ({ _id, caption, lqip, aspectRatio }: ImageType) => {
  const width = Math.round(200 * aspectRatio);

  return (
    <figure
      className="relative flex-none shrink-0 snap-center overflow-hidden first:pl-8 last:pr-8"
      style={{ width }}
    >
      <div className="relative flex overflow-hidden rounded">
        <Image
          {...useSanityImageProps(_id)}
          width={width}
          height={200}
          quality={30}
          placeholder="blur"
          blurDataURL={lqip}
          alt={caption || ""}
        />
      </div>
      <figcaption
        aria-hidden
        className="mt-1 flex items-center text-sm text-gray-600"
      >
        {caption}
      </figcaption>
    </figure>
  );
};

const Gallery = ({ images }: { images: ImageType[] }) => (
  <div className="relative flex w-full snap-x gap-6 overflow-x-auto pb-14">
    <div className="shrink-0 snap-center">
      <div className="w-4 shrink-0 sm:w-48" />
    </div>
    {images.map((image) => (
      <GalleryFigure {...image} key={image._id} />
    ))}
    <div className="shrink-0 snap-center">
      <div className="w-4 shrink-0 sm:w-48" />
    </div>
  </div>
);

export default Gallery;
