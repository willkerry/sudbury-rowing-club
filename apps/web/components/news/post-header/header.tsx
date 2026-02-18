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
    placeholder="blur"
    blurDataURL={lqip}
    alt={alt}
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
    portrait: {
      width: Math.round(512 * featuredImage.aspectRatio),
      height: 512,
    },
    landscape: {
      width: 768,
      height: Math.round(768 / featuredImage.aspectRatio),
    },
  }[orientation];

  return (
    <LightBoxTrigger
      className="hover:cursor-zoom-in"
      aria-label={`View the '${title}' image in lightbox`}
    >
      <PostHeaderImage
        id={featuredImage._id}
        alt={featuredImage.alt || featuredImage.caption || title}
        lqip={featuredImage.lqip}
        width={width}
        height={height}
      />
    </LightBoxTrigger>
  );
};

export const PostHeader = ({ title, date, featuredImage }: Props) => {
  if (featuredImage && featuredImage.aspectRatio > 1)
    return (
      <LightBox
        src={urlFor(featuredImage._id).url()}
        alt={featuredImage.alt || featuredImage.caption || title}
        aspectRatio={featuredImage.aspectRatio}
        lqip={featuredImage.lqip}
      >
        <PostTitle date={date} title={title} center />
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
        src={urlFor(featuredImage._id).url()}
        alt={featuredImage.alt || featuredImage.caption || title}
        aspectRatio={featuredImage.aspectRatio}
        lqip={featuredImage.lqip}
      >
        <div className="mx-auto mb-8 max-w-3xl flex-row items-center gap-8 sm:flex md:mb-16">
          <PostTitle date={date} title={title} />
          <div className="relative flex-none">
            <figure
              className="flex flex-col overflow-hidden rounded-sm shadow-lg"
              style={{
                maxWidth: 512 * featuredImage.aspectRatio,
                backgroundColor: featuredImage.background || undefined,
                color: featuredImage.foreground || undefined,
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

  return <PostTitle date={date} title={title} center />;
};
