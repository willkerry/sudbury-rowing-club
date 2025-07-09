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
import { OEmbed } from "@/components/oembed/oembed";
import { SanityFigure } from "@/components/stour/figure";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type WrappedPortableTextProps = PortableTextProps & {
  className?: string;
};

const NOTE_ICONS = {
  primary: InfoIcon,
  secondary: HelpCircle,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
} as const;

const NoteIcon = ({ type }: { type: keyof typeof NOTE_ICONS }) => {
  const Icon = NOTE_ICONS[type] ?? NOTE_ICONS.primary;

  return <Icon aria-hidden={true} className="h-4 w-4" />;
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
          value={smartQuotesDeep(value)}
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
  if (!(input && Array.isArray(input))) return input;

  return input.map((item) => ({
    ...item,
    children: item.children?.map((child: Record<string, string>) => {
      if (child.text) return { ...child, text: smartQuotes(child.text) };

      return child;
    }),
  }));
}
