import Image from "next/image";
import { urlFor } from "@sudburyrc/api";

type ImageType = {
  _id: string;
  caption?: string;
  lqip?: string;
  aspectRatio: number;
};

const Gallery = ({ images }: { images: ImageType[] }) => (
  <div className="relative flex w-full snap-x gap-6 overflow-x-auto pb-14">
    <div className="shrink-0 snap-center">
      <div className="w-4 shrink-0 sm:w-48" />
    </div>
    {images.map((image) => (
      <figure
        key={image._id}
        className="relative flex-none shrink-0 snap-center overflow-hidden first:pl-8 last:pr-8"
        style={{
          width: 200 * image.aspectRatio,
        }}
      >
        <div className="relative flex overflow-hidden rounded">
          <Image
            src={urlFor(image._id).height(400).url()}
            width={200 * image.aspectRatio}
            height={200}
            placeholder="blur"
            blurDataURL={image.lqip}
            alt={image.caption || ""}
          />
        </div>
        <figcaption className="mt-1 flex items-center text-sm text-gray-600">
          {image.caption}
        </figcaption>
      </figure>
    ))}
    <div className="shrink-0 snap-center">
      <div className="w-4 shrink-0 sm:w-48" />
    </div>
  </div>
);

export default Gallery;
