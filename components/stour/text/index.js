import cn from "classnames";
import { PropTypes } from "prop-types";
import { PortableText } from "@/lib/sanity";

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
export default function Text({
  children,
  type,
  size,
  portableText,
  lead,
  className,
}) {
  const classes = cn(
    "prose",
    VARIANT_MAPS[type],
    SIZE_MAPS[size],
    className,
    lead && "auto-lead"
  );
  return portableText ? (
    <PortableText className={classes} blocks={children} />
  ) : (
    <div className={classes}>{children}</div>
  );
}

Text.propTypes = {
  /**
   * Make the text `invert`ed or give it `secondary` significance. **Only works for simple text, not lists, blockquotes etc.**
   * @type {("default"|"invert"|"secondary")}
   * @default "default"
   * @example
   * <Text type="invert">
   *  <h1>This is inverted text</h1>
   * </Text>
   * <Text type="secondary">
   * <h1>This is secondary text</h1>
   * </Text>
   * @example
   */
  type: PropTypes.oneOf(["default", "invert", "secondary"]),
  /**
   * How big do we want this text.
   * @default "base"
   * @type {("sm"|"base"|"large")}
   * @example
   * <Text size="base">
   *  <p>
   *   This is a base text.
   * </p>
   * </Text>
   * <Text size="large">
   * <p>
   *  This is a large text.
   * </p>
   * </Text>
   * <Text size="sm">
   * <p>
   * This is a small text.
   * </p>
   * </Text>
   */
  size: PropTypes.oneOf(["base", "small", "large"]),
  /**
   * The text to display.
   * @type {node}
   * @required
   * @example
   * <Text>
   *  Hello world!
   * </Text>
   */
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.string,
  ]).isRequired,
  /**
   * Add a class to the text.
   * @type {string}
   * @example
   * <Text className="my-class">
   * Hello world!
   * </Text>
   */
  className: PropTypes.string,
  /**
   * Add a lead class to the text.
   * @type {string}
   * @example
   * <Text lead>
   * Hello world!
   * </Text>
   */
  lead: PropTypes.bool,
  /**
   * Use a Portable Text. If you use this, you don't need to pass children, but do need to pass an array of blocks to `block` prop.
   * @type {boolean}
   * @example
   * <Text portableText blocks={children}/>
   */
  portableText: PropTypes.bool,
};

Text.defaultProps = {
  type: "default",
  size: "base",
  lead: false,
  portableText: false,
  className: "",
};

Text.type = VARIANT_MAPS;
Text.size = SIZE_MAPS;
