import Image from "next/image";
import SanityBlockContent from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Note from "@/components/stour/note";
import { config } from "./config";

export const urlFor = (source) => imageUrlBuilder(config).image(source);

const WIDTH = 650;

const serializers = {
  marks: {
    link: ({ mark, children }) => {
      const { href } = mark;
      return <Link href={href}>{`${children}`}</Link>;
    },
  },
  types: {
    code: (props) => (
      <pre data-language={props.node.language}>
        <code>{props.node.code}</code>
      </pre>
    ),
    quote: (props) => (
      <figure>
        <blockquote>
          <PortableText blocks={props.node.quote} />
        </blockquote>
        <figcaption>{props.node.attribution}</figcaption>
      </figure>
    ),
    note: (props) => (
      <Note label={props.node.label} type={props.node.type}>
        {props.node.note}
      </Note>
    ),

    figure: (props) => {
      const { node } = props;
      const { caption, image, altText, lqip, aspectRatio, description } = node;
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

export function PortableText(props) {
  // eslint-disable-next-line react/prop-types
  const { blocks } = props;

  if (blocks) {
    return (
      <SanityBlockContent
        blocks={blocks}
        serializers={serializers}
        renderContainerOnSingleChild
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...config}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    );
  }
  return null;
}
