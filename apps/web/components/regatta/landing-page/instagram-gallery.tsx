import Instagram from "@/components/icons/socials/instagram";
import Container from "@/components/layouts/container";
import Loading from "@/components/stour/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import DateFormatter from "@/components/utils/date-formatter";
import useInstagramPosts, {
  type InstagramPost,
} from "@/hooks/useInstagramPosts";
import { useInViewport, useReducedMotion } from "@mantine/hooks";
import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useState } from "react";

const IMAGE_CLASS_NAME =
  "h-48 w-full border-b bg-gray-100 object-cover sm:h-80";

const PLACEHOLDER =
  "█████████\n\n█████████ ███ ██████ ███ ███\n█ ██████ ██ █████ █ ███ ███ ███ █████████\n\n██████  █████  █████";

const InstagramFullPost = ({ post }: { post: InstagramPost }) => {
  const { ref, inViewport } = useInViewport();
  const [latchedInViewport, setLatchedInViewport] = useState(inViewport);

  useEffect(() => {
    if (inViewport) {
      setLatchedInViewport(true);
    }
  }, [inViewport]);

  return (
    <figure className="relative overflow-hidden rounded-sm border" ref={ref}>
      {latchedInViewport ? (
        <img
          src={post.displayUrl}
          alt={post.alt || ""}
          width={post.dimensionsWidth}
          height={post.dimensionsHeight}
          className={IMAGE_CLASS_NAME}
          ref={ref}
          loading="lazy"
        />
      ) : (
        <div className={IMAGE_CLASS_NAME}>
          <Loading />
        </div>
      )}

      <figcaption className="p-2 text-xs">
        <p className="whitespace-pre-wrap leading-tight">
          <div className="line-clamp-6">
            <span className="font-semibold">{post.ownerUsername}</span>{" "}
            {post.caption}
          </div>
        </p>

        <div className="mt-2 flex gap-2 text-gray-600">
          <span className="font-semibold text-xs">{post.likesCount} likes</span>
          <DateFormatter dateString={post.timestamp} />
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-rose-600"
          >
            <Instagram className="h-3 w-3" />
            Open
          </a>
        </div>
      </figcaption>
    </figure>
  );
};

export const InstagramGallery = () => {
  const { data: posts, error, status } = useInstagramPosts();
  const reduceMotion = useReducedMotion();

  return (
    <Carousel
      className="relative mb-24"
      opts={{ loop: true }}
      plugins={[
        AutoScroll({
          active: !reduceMotion,
          speed: 0.25,
          stopOnInteraction: false,
        }),
      ]}
    >
      <CarouselContent className="mx-4">
        {status === "success" &&
          posts
            ?.filter((post) => post.type === "Image" || post.type === "Sidecar")
            .map((post) => (
              <CarouselItem
                key={post.id}
                id={post.id}
                className="basis-[80%] sm:basis-1/2 lg:basis-1/4"
              >
                <InstagramFullPost post={post} />
              </CarouselItem>
            ))}

        {status === "pending" &&
          new Array(6).fill(null).map((_, index) => (
            <CarouselItem
              key={index}
              className="basis-[80%] animate-pulse sm:basis-1/2 lg:basis-1/4"
            >
              <figure className="overflow-hidden rounded-sm border">
                <div className={IMAGE_CLASS_NAME} />
                <div
                  className="whitespace-pre-wrap p-2 text-xs opacity-0"
                  aria-hidden
                >
                  <p>{PLACEHOLDER}</p>
                </div>
              </figure>
            </CarouselItem>
          ))}

        {status === "error" && (
          <Container>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error?.message}</AlertDescription>
            </Alert>
          </Container>
        )}
      </CarouselContent>
    </Carousel>
  );
};
