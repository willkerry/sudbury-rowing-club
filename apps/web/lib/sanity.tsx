import {
  PortableText as BlockContent,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import { smartQuotes } from "@sudburyrc/helpers";
import Link from "next/link";
import type { ComponentProps } from "react";
import { OEmbed } from "@/components/oembed/oembed";
import { SanityFigure } from "@/components/stour/figure";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "./utils";

type WrappedPortableTextProps = PortableTextProps & {
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  /* @deprecated - use wrapperProps.className instead */
  className?: string;
};

const mapNoteTypeToAlertVariant = (
  type: string,
): ComponentProps<typeof Alert>["variant"] => {
  switch (type) {
    case "warning":
      return "warn";
    case "error":
      return "destructive";
    default:
      return "default";
  }
};

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => <Link href={value?.href}>{children}</Link>,
    normal: ({ value }) => <pre>{JSON.stringify(value)}</pre>,
  },

  types: {
    code: ({ value }) => (
      <pre data-language={value?.language}>
        <code>{value?.code}</code>
      </pre>
    ),
    figure: ({ value }) => <SanityFigure value={value} />,
    note: ({ value }) => (
      <Alert
        className="not-prose"
        variant={mapNoteTypeToAlertVariant(value?.type)}
      >
        {value?.label && <AlertTitle>{value?.label}</AlertTitle>}
        {value?.note && <AlertDescription>{value?.note}</AlertDescription>}
      </Alert>
    ),
    oembed: ({ value }) => <OEmbed url={value?.url} />,
    quote: ({ value }) => (
      <figure>
        <blockquote>
          <PortableText value={value?.quote} />
        </blockquote>
        <figcaption className="-mt-4 pl-3.5">{value?.attribution}</figcaption>
      </figure>
    ),
  },
};

export function PortableText({
  value,
  className,
  wrapperProps,
  ...rest
}: WrappedPortableTextProps) {
  if (!value) return null;

  return (
    <div {...wrapperProps} className={cn(className, wrapperProps?.className)}>
      <BlockContent
        components={components}
        value={smartQuotesDeep(value)}
        {...rest}
      />
    </div>
  );
}

function smartQuotesDeep(
  input: PortableTextProps["value"],
): PortableTextProps["value"] {
  if (!(input && Array.isArray(input))) return input;

  return input.map((item) => ({
    ...item,
    children: item.children?.map((child: Record<string, string>) => {
      if (child.text) return { ...child, text: smartQuotes(child.text) };

      return child;
    }),
  }));
}
