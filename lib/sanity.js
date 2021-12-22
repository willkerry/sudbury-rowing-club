import Image from "next/image";
import SanityBlockContent from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Note from "@/components/stour/note";
import { config } from "./config";

export const urlFor = (source) => imageUrlBuilder(config).image(source);

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
      const altText = props.node.altText || props.node.caption;
      const captionText = props.node.caption || props.node.description || "";
      return (
        <figure>
          <Image
            src={
              props.node.aspectRatio
                ? urlFor(props.node.image).width(1300).fit("max").url()
                : urlFor(props.node.image)
                    .width(1300)
                    .height(800)
                    .fit("min")
                    .url()
            }
            width={650}
            height={props.node.aspectRatio ? 650 / props.node.aspectRatio : 400}
            alt={altText}
          />
          {captionText}
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
