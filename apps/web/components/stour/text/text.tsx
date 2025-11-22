import type { PortableTextProps } from "@portabletext/react";
import { cva, type VariantProps } from "class-variance-authority";
import { PortableText } from "@/lib/sanity";
import { cn } from "@/lib/utils";

const variants = cva(["prose", "prose-lead:font-medium prose-lead:font-sans"], {
  variants: {
    type: {
      default: "",
      invert: "text-white",
      secondary: "text-gray-500",
    },
    size: {
      small: "prose-sm",
      base: "",
      large: "prose-lg",
      xlarge: "prose-xl",
    },
    font: {
      sans: "",
      serif:
        "prose-p:font-[360] prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed",
    },
    lead: {
      true: "auto-lead",
      false: "",
    },
  },
  defaultVariants: {
    type: "default",
    size: "base",
    font: "sans",
    lead: false,
  },
});

type Props = React.HTMLAttributes<HTMLDivElement> & {
  portableText?: PortableTextProps["value"];
} & VariantProps<typeof variants>;

export const Text = ({
  type,
  size,
  font,
  children,
  className,
  lead,
  portableText,
  ...props
}: Props) => {
  const classes = cn(variants({ type, size, font, lead }), className);

  if (portableText) {
    return (
      <PortableText
        value={portableText}
        wrapperProps={{ className: classes, ...props }}
      />
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};
