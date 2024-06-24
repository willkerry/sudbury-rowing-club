"use client";

import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReducedMotion } from "@mantine/hooks";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const WIDTH = 720;
const HEIGHT = 480;

type ImageType = {
  _id: string;
  caption?: string;
  lqip?: string;
  aspectRatio: number;
  href?: string;
};

const GalleryFigure = ({ _id, caption, lqip, href }: ImageType) => {
  const { loader, src } = useSanityImageProps(_id, {
    imageBuilder: (builder) =>
      builder.size(WIDTH, HEIGHT).fit("clip").quality(25).auto("format"),
  });

  const imageProps: ComponentProps<typeof Image> = {
    loader,
    src,
    width: WIDTH,
    height: HEIGHT,
    unoptimized: true,
    quality: 30,
    placeholder: "blur",
    blurDataURL: lqip,
    alt: caption || "",
    sizes: "(min-width: 640px) 100vw, 30vw",
    className: "rounded shadow",
  };

  return (
    <figure>
      {href ? (
        <Link href={href}>
          <Image {...imageProps} />
        </Link>
      ) : (
        <Image {...imageProps} />
      )}

      <figcaption
        aria-hidden
        className="mt-1 flex items-center text-sm text-gray-600"
      >
        {caption}
      </figcaption>
    </figure>
  );
};

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
