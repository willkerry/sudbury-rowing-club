import cn from "classnames";
import { PropTypes } from "prop-types";
import ReactMarkdown from "react-markdown";
import smartypants from "@silvenon/remark-smartypants";

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
  const { children, type, size, markdown } = props;
  return (
    <div className={cn("prose", VARIANT_MAPS[type], SIZE_MAPS[size])}>
      {markdown ? (
        <ReactMarkdown remarkPlugins={[smartypants]}>{children}</ReactMarkdown>
      ) : (
        children
      )}
    </div>
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
};

Text.type = VARIANT_MAPS;
Text.size = SIZE_MAPS;

export default Text;
