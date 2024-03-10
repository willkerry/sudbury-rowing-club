import Image from "next/image";
import { useReducedMotion } from "@mantine/hooks";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

type ImageType = {
  _id: string;
  caption?: string;
  lqip?: string;
  aspectRatio: number;
};

const GalleryFigure = ({ _id, caption, lqip }: ImageType) => (
  <figure>
    <Image
      {...useSanityImageProps(_id, {
        imageBuilder: (builder) =>
          builder.size(720, 480).fit("clip").quality(25).auto("format"),
      })}
      width={720}
      height={480}
      quality={30}
      placeholder="blur"
      blurDataURL={lqip}
      alt={caption || ""}
      sizes="(min-width: 640px) 100vw, 30vw"
      className="rounded"
    />

    <figcaption
      aria-hidden
      className="mt-1 flex items-center text-sm text-gray-600"
    >
      {caption}
    </figcaption>
  </figure>
);

const Gallery = ({ images }: { images: ImageType[] }) => {
  const reduceMotion = useReducedMotion();

  return (
    <Carousel
      className="relative"
      opts={{
        loop: true,
      }}
      plugins={[
        AutoScroll({
          active: !reduceMotion,
          speed: 0.25,
          stopOnInteraction: false,
        }),
      ]}
    >
      <CarouselContent className="mx-4">
        {images.map((image) => (
          <CarouselItem
            key={image._id}
            id={image._id}
            className="basis-[80%] sm:basis-1/2 lg:basis-1/4"
          >
            <GalleryFigure {...image} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Gallery;
