import Image from "next/image";
import { urlFor } from "@/lib/sanity";

type Image = {
  _id: string;
  caption: string;
  lqip: string;
  aspectRatio: number;
};

const Gallery = ({ images }: { images: Image[] }) => (
  <div className="relative flex w-full gap-6 overflow-x-auto snap-x pb-14">
    <div className="snap-center shrink-0">
      <div className="w-4 shrink-0 sm:w-48" />
    </div>
    {images.map((image) => (
      <figure
        key={image._id}
        className="relative flex-none overflow-hidden snap-center shrink-0 first:pl-8 last:pr-8"
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
            alt={image.caption}
          />
        </div>
        <figcaption className="flex items-center mt-1 text-sm text-gray-600">
          {image.caption}
        </figcaption>
      </figure>
    ))}
    <div className="snap-center shrink-0">
      <div className="w-4 shrink-0 sm:w-48" />
    </div>
  </div>
);

export default Gallery;
