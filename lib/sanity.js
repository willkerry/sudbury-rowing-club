import { config } from "./config";
import Image from "next/image";
import SanityBlockContent from "@sanity/block-content-to-react";
import imageUrlBuilder from "@sanity/image-url";
import Note from "@/components/stour/note";
import Link from "next/link";

/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-url
 **/
export const urlFor = (source) => imageUrlBuilder(config).image(source);

const serializers = {
  marks: {
    link: ({ mark, children }) => {
      const { href } = mark;
      return (
        <Link href={href}>
          {`${children}`}
        </Link>
      );
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

    figure: (props) => (
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
          alt={
            props.node.alt
              ? props.node.alt
              : props.node.altText
              ? props.node.altText
              : ""
          }
        />
        {props.node.caption ? (
          <figcaption>{props.node.caption}</figcaption>
        ) : props.node.description ? (
          <figcaption>{props.node.description}</figcaption>
        ) : null}
      </figure>
    ),
  },
};

export function PortableText(props) {
  const { blocks } = props;

  if (!blocks) {
    console.error("Missing blocks");
    return null;
  }

  return (
    <SanityBlockContent
      blocks={blocks}
      serializers={serializers}
      renderContainerOnSingleChild={true}
      {...config}
      {...props}
    />
  );
}
