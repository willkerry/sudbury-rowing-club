"use client";

import Link from "next/link";
import {
  PortableText as BlockContent,
  PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import Figure from "@/components/stour/figure";
import Note from "@/components/stour/note";

type WrappedPortableTextProps = PortableTextProps & {
  className?: string;
};

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => <Link href={value?.href}>{children}</Link>,
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
      <Note size="small" label={value?.label} type={value?.type}>
        {value?.note}
      </Note>
    ),
    figure: Figure,
  },
};

export function PortableText({
  value,
  className = "",
  ...rest
}: WrappedPortableTextProps) {
  if (value) {
    return (
      <div {...{ className }}>
        <BlockContent {...{ components, value }} {...rest} />
      </div>
    );
  }
  return null;
}
