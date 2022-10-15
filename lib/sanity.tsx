import Image from "next/image";
import {
  PortableText as BlockContent,
  PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Note from "@/components/stour/note";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { config } from "./sanity.server";

export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(config).image(source);

const WIDTH = 650;

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => (
      <Link href={value?.href} passHref>
        <a>{children}</a>
      </Link>
    ),
  },
  types: {
    code: ({ value }) => (
      <pre data-language={value?.language}>
        <code>{value?.code}</code>
      </pre>
    ),
    quote: ({ value }) => (
      <figure>
        <blockquote>
          <PortableText value={value?.quote} />
        </blockquote>
        <figcaption>{value?.attribution}</figcaption>
      </figure>
    ),
    note: ({ value }) => (
      <Note label={value?.label} type={value?.type}>
        {value?.note}
      </Note>
    ),
    figure: ({ value }) => {
      const { caption, image, altText, lqip, aspectRatio, description } = value;
      const alt = altText || caption;
      const captionText = caption || description || "";
      const width = aspectRatio < 1 ? WIDTH * 0.6 : WIDTH * aspectRatio;
      const height = width / aspectRatio;
      return (
        <figure>
          <Image
            src={
              aspectRatio
                ? urlFor(image).width(1300).fit("max").url()
                : urlFor(image)
                    .width(width * 2)
                    .height(height * 2)
                    .fit("min")
                    .url()
            }
            width={width}
            placeholder="blur"
            blurDataURL={lqip}
            height={height}
            alt={alt}
          />
          {captionText !== null && <figcaption>{captionText}</figcaption>}
        </figure>
      );
    },
  },
};

type WrappedPortableTextProps = PortableTextProps & {
  className?: string;
};

export function PortableText({
  value,
  className,
  ...rest
}: WrappedPortableTextProps) {
  if (value) {
    return (
      <div {...{ className }}>
        <BlockContent {...{ components, value }} {...config} {...rest} />
      </div>
    );
  }
  return null;
}

PortableText.defaultProps = {
  className: "",
};
