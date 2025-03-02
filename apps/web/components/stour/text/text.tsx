import { PortableText } from "@/lib/sanity";
import type { PortableTextProps } from "@portabletext/react";
import { type VariantProps, cva } from "class-variance-authority";
import cn from "clsx";

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

type Props = {
  children?: React.ReactNode;
  className?: string;
  portableText?: PortableTextProps["value"];
} & VariantProps<typeof variants>;

const Text = ({
  type,
  size,
  font,
  children,
  className,
  lead,
  portableText,
}: Props) => {
  const classes = cn(variants({ type, size, font, lead }), className);

  return portableText ? (
    <PortableText className={classes} value={portableText} />
  ) : (
    <div className={classes}>{children}</div>
  );
};

export default Text;
