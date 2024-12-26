import { SanityFigure } from "@/components/stour/figure";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  PortableText as BlockContent,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";
import { smartQuotes } from "@sudburyrc/helpers";
import {
  AlertCircle,
  CheckCircle,
  HelpCircle,
  InfoIcon,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { OEmbed } from "../components/oembed/oembed";

type WrappedPortableTextProps = PortableTextProps & {
  className?: string;
};

const NoteIcon = ({
  type,
}: { type: "primary" | "secondary" | "success" | "warning" | "error" }) => {
  const props = {
    "aria-hidden": true,
    className: "h-4 w-4",
  };

  switch (type) {
    case "primary":
      return <InfoIcon {...props} />;
    case "secondary":
      return <HelpCircle {...props} />;
    case "success":
      return <CheckCircle {...props} />;
    case "warning":
      return <AlertCircle {...props} />;
    case "error":
      return <XCircle {...props} />;
    default:
      return <InfoIcon {...props} />;
  }
};

const components: PortableTextComponents = {
  marks: {
    normal: ({ value }) => <pre>{JSON.stringify(value)}</pre>,
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
        <figcaption className="-mt-4 pl-3.5">{value?.attribution}</figcaption>
      </figure>
    ),
    note: ({ value }) => (
      <Alert
        className="not-prose"
        variant={
          value?.type === "warning" || value?.type === "error"
            ? "destructive"
            : "default"
        }
      >
        <NoteIcon type={value?.type} />
        <AlertTitle>{value?.label}</AlertTitle>
        <AlertDescription>{value?.note}</AlertDescription>
      </Alert>
    ),
    figure: ({ value }) => <SanityFigure value={value} />,
    oembed: ({ value }) => <OEmbed url={value?.url} />,
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
        <BlockContent
          components={components}
          // value={smartQuotesDeep(value)}
          value={value}
          {...rest}
        />
      </div>
    );
  }
  return null;
}

function smartQuotesDeep(
  input: PortableTextProps["value"],
): PortableTextProps["value"] {
  if (!input) return input;
  if (!Array.isArray(input)) return input;

  return input.map((item) => {
    return {
      ...item,
      children: item.children?.map((child: Record<string, string>) => {
        if (child.text) return { ...child, text: smartQuotes(child.text) };

        return child;
      }),
    };
  });
}
