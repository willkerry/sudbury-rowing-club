import { React } from "react";
import cn from "classnames";
import { PropTypes } from "prop-types";
import Link from "next/link";

const SIZE_MAPS = {
  mini: "py-1 px-2 min-w-min w-24 text-xs",
  small: "py-1.5 px-3 min-w-min w-36 text-sm",
  medium: "py-2 px-4 min-w-min w-40 text-sm",
  large: "py-2 px-8 min-w-min w-64",
  auto: "py-2 px-4 text-sm",
};
const SHADOW_MAPS = {
  true: "shadow-lg hover:shadow",
};
const VARIANT_MAPS = {
  primary: "text-gray-700 hover:border-black hover:text-black",
  secondary:
    "text-white border-gray-900 bg-gray-900 hover:text-gray-900 hover:bg-white",
  brandDark:
    "text-white border-sudbury-brand bg-sudbury-brand hover:text-sudbury-brand hover:bg-white",
  brand:
    "text-white border-sudbury bg-sudbury hover:text-sudbury hover:bg-white",
  brandLight:
    "text-white border-sudbury-light bg-sudbury-light hover:text-sudbury-light hover:bg-white",
  success:
    "text-white border-green-600 bg-green-600 hover:text-green-700 hover:bg-white",
  error:
    "text-white border-red-600 bg-red-600 hover:text-red-700 hover:bg-white",
};
export function Button(props) {
  const { label, type, size, shadow, href } = props;
  return (
    <Link href={href} passHref>
      <a
        className={cn(
          "rounded-md transition duration-300 border",
          VARIANT_MAPS[type],
          SIZE_MAPS[size],
          SHADOW_MAPS[shadow]
        )}
      >
        {label}
      </a>
    </Link>
  );
}

Button.propTypes = {
  /**
   * This is just the button text.
   */
  label: PropTypes.string,
  /**
   * Pick a colour.
   */
  type: PropTypes.oneOf([
    "primary",
    "secondary",
    "brandDark",
    "brand",
    "brandLight",
    "success",
    "error",
  ]),
  /**
   * Where are we headed? Routes through, `next/link`, so relative URLs will maintain SPA behaviour.
   */
  href: PropTypes.string,
  /**
   * Pick a size. Use `auto` anywhere users can change button text.
   */
  size: PropTypes.oneOf(["auto", "mini", "small", "medium", "large"]),
  /**
   * Optionally, give the button a shadow.
   */
  shadow: PropTypes.bool,
};

Button.defaultProps = {
  type: "primary",
  size: "auto",
  shadow: false,
  href: "/",
};

Button.type = VARIANT_MAPS;
Button.size = SIZE_MAPS;
Button.shadow = SHADOW_MAPS;

export default Button;
