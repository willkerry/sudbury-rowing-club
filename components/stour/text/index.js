import cn from "classnames";
import { PropTypes } from "prop-types";
import { PortableText } from "@/lib/sanity";

import dynamic from "next/dynamic";

const ReactMarkdown = dynamic(() => import("react-markdown"));

const SIZE_MAPS = {
  sm: "prose-sm",
  base: "",
  large: "prose-lg",
};
const VARIANT_MAPS = {
  default: "",
  invert: "text-white",
  secondary: "text-gray-500",
};
export function Text(props) {
  const { children, type, size, markdown, portableText, lead } = props;
  const classes = cn(
    "prose",
    VARIANT_MAPS[type],
    SIZE_MAPS[size],
    props.className,
    lead && "auto-lead"
  );
  return markdown ? (
    <ReactMarkdown className={classes}>
      {children}
    </ReactMarkdown>
  ) : portableText ? (
    <PortableText className={classes} blocks={children} />
  ) : (
    <div className={classes}>{children}</div>
  );
}

Text.propTypes = {
  /**
   * Parse Markdown? **Causes an error in Storybook.**
   */
  markdown: PropTypes.bool,
  /**
   * Make the text `invert`ed or give it `secondary` significance. **Only works for simple text, not lists, blockquotes etc.**
   */
  type: PropTypes.oneOf(["default", "invert", "secondary"]),
  /**
   * How big do we want this text.
   */
  size: PropTypes.oneOf(["base", "small", "large"]),
};

Text.defaultProps = {
  type: "default",
  size: "base",
  markdown: false,
  lead: false,
};

Text.type = VARIANT_MAPS;
Text.size = SIZE_MAPS;

export default Text;
