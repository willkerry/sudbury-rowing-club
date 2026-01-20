"use client";

import { useReducedMotion } from "@mantine/hooks";
import type { SudburyImage } from "@sudburyrc/api";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const WIDTH = 720;
const HEIGHT = 480;

const GalleryFigure = ({
  _id,
  caption,
  lqip,
  href,
}: SudburyImage & { href?: string }) => {
  const { loader, src } = useSanityImageProps(_id, {
    imageBuilder: (builder) =>
      builder.size(WIDTH, HEIGHT).fit("clip").quality(60).auto("format"),
  });

  const imageProps: ComponentProps<typeof Image> = {
    loader,
    src,
    width: WIDTH,
    height: HEIGHT,
    unoptimized: true,
    quality: 60,
    placeholder: "blur",
    blurDataURL: lqip,
    alt: caption || "",
    sizes: "(min-width: 640px) 100vw, 30vw",
    className: "rounded-sm shadow-sm",
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

      {caption && (
        <figcaption className="mt-1 flex items-center text-gray-600 text-sm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export const Gallery = ({ images }: { images: SudburyImage[] }) => {
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
