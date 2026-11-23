import type { PortableTextProps } from "@portabletext/react";
import { cva, type VariantProps } from "class-variance-authority";
import { PortableText } from "@/lib/sanity";
import { cn } from "@/lib/utils";

const variants = cva(["prose", "prose-lead:font-sans prose-lead:font-medium"], {
  defaultVariants: {
    font: "sans",
    lead: false,
    size: "base",
    type: "default",
  },
  variants: {
    font: {
      sans: "",
      serif:
        "prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed prose-p:font-[360]",
    },
    lead: {
      false: "",
      true: "auto-lead",
    },
    size: {
      base: "",
      large: "prose-lg",
      small: "prose-sm",
      xlarge: "prose-xl",
    },
    type: {
      default: "",
      invert: "text-white",
      secondary: "text-gray-500",
    },
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
