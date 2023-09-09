import {
  PortableText as BlockContent,
  PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import Link from "next/link";
import Note from "@/components/stour/note";
import Figure from "@/components/stour/figure";

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
          {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
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
