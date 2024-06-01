import { PortableText } from "@/lib/sanity";
import type { PortableTextProps } from "@portabletext/react";
import cn from "clsx";

type Props = {
  type?: "default" | "invert" | "secondary";
  size?: "base" | "small" | "large";
  children?: React.ReactNode;
  className?: string;
  lead?: boolean;
  portableText?: PortableTextProps["value"];
};

const SIZE_MAPS = {
  small: "prose-sm",
  base: "",
  large: "prose-lg",
};
const VARIANT_MAPS = {
  default: "",
  invert: "text-white",
  secondary: "text-gray-500",
};

const Text = ({
  type = "default",
  size = "base",
  children,
  className,
  lead,
  portableText,
}: Props) => {
  const classes = cn(
    "prose",
    VARIANT_MAPS[type],
    SIZE_MAPS[size],
    className,
    lead && "auto-lead",
  );
  return portableText ? (
    <PortableText className={classes} value={portableText} />
  ) : (
    <div className={classes}>{children}</div>
  );
};

export default Text;
