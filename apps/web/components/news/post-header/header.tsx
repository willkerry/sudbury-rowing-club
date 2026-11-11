"use client";

import { type Article, urlFor } from "@sudburyrc/api";
import Image from "next/image";
import { LightBox, LightBoxTrigger } from "@/components/stour/lightbox";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import { Caption } from "./caption";
import { PostTitle } from "./title";

type Props = Pick<Article, "title" | "date" | "featuredImage">;

const PostHeaderImage = ({
  alt,
  id,
  lqip,
  ...rest
}: {
  id: string;
  alt: string;
  lqip: string;
  width: number;
  height: number;
}) => (
  <Image
    {...useSanityImageProps(id, {
      imageBuilder: (b, o) =>
        o.width ? b.width(o.width).fit("max") : b.width(256).fit("max"),
    })}
    alt={alt}
    blurDataURL={lqip}
    placeholder="blur"
    {...rest}
  />
);

const PortraitOrLandscapeImage = ({
  featuredImage,
  orientation,
  title,
}: Pick<Article, "featuredImage"> & {
  orientation: "portrait" | "landscape";
  title: string;
}) => {
  if (!featuredImage) return null;

  const { width, height } = {
    landscape: {
      height: Math.round(768 / featuredImage.aspectRatio),
      width: 768,
    },
    portrait: {
      height: 512,
      width: Math.round(512 * featuredImage.aspectRatio),
    },
  }[orientation];

  return (
    <LightBoxTrigger
      aria-label={`View the '${title}' image in lightbox`}
      className="hover:cursor-zoom-in"
    >
      <PostHeaderImage
        alt={featuredImage.alt || featuredImage.caption || title}
        height={height}
        id={featuredImage._id}
        lqip={featuredImage.lqip}
        width={width}
      />
    </LightBoxTrigger>
  );
};

export const PostHeader = ({ title, date, featuredImage }: Props) => {
  if (featuredImage && featuredImage.aspectRatio > 1)
    return (
      <LightBox
        alt={featuredImage.alt || featuredImage.caption || title}
        aspectRatio={featuredImage.aspectRatio}
        lqip={featuredImage.lqip}
        src={urlFor(featuredImage._id).url()}
      >
        <PostTitle center date={date} title={title} />
        <div className="mb-8 sm:mx-0 md:mb-16">
          <figure
            className="relative mx-auto flex max-w-3xl flex-col overflow-hidden rounded-sm bg-gray-200 text-gray-600"
            style={{
              backgroundColor: featuredImage.background || "transparent",
              color: featuredImage.foreground || "inherit",
            }}
          >
            <PortraitOrLandscapeImage
              featuredImage={featuredImage}
              orientation="landscape"
              title={title}
            />
            {featuredImage.caption && (
              <Caption caption={featuredImage.caption} />
            )}
          </figure>
        </div>
      </LightBox>
    );

  if (featuredImage)
    return (
      <LightBox
        alt={featuredImage.alt || featuredImage.caption || title}
        aspectRatio={featuredImage.aspectRatio}
        lqip={featuredImage.lqip}
        src={urlFor(featuredImage._id).url()}
      >
        <div className="mx-auto mb-8 max-w-3xl flex-row items-center gap-8 sm:flex md:mb-16">
          <PostTitle date={date} title={title} />
          <div className="relative flex-none">
            <figure
              className="flex flex-col overflow-hidden rounded-sm shadow-lg"
              style={{
                backgroundColor: featuredImage.background || undefined,
                color: featuredImage.foreground || undefined,
                maxWidth: 512 * featuredImage.aspectRatio,
              }}
            >
              <PortraitOrLandscapeImage
                featuredImage={featuredImage}
                orientation="portrait"
                title={title}
              />
              {featuredImage.caption && (
                <Caption caption={featuredImage.caption} />
              )}
            </figure>
          </div>
        </div>
      </LightBox>
    );

  return <PostTitle center date={date} title={title} />;
};
