import { React } from "react";
import cn from "classnames";
import { PropTypes } from "prop-types";
import Link from "next/link";
import { DownloadIcon, ExternalLinkIcon } from "@heroicons/react/outline";

const SIZE_MAPS = {
  mini: "py-1 px-2 min-w-min w-18 text-xs",
  small: "py-1.5 px-3 min-w-min w-24 text-sm",
  medium: "py-2 px-4 min-w-min w-40 text-sm",
  large: "py-2 px-8 min-w-min w-64",
  auto: "py-2 px-4 text-sm",
};
const SHADOW_MAPS = {
  true: "shadow-lg hover:shadow",
  false: null,
};
const ICON_MAPS = {
  external: <ExternalLinkIcon className="w-3 h-3 ml-2" />,
  download: <DownloadIcon className="w-3 h-3 ml-2" />,
};
const VARIANT_MAPS = {
  primary: "!text-gray-700 hover:border-black hover:text-black",
  secondary:
    "text-white border-gray-900 bg-gray-900 hover:text-gray-900 hover:bg-white",
  brandDark:
    "text-white border-blue-800 bg-blue-800 hover:text-blue-800 hover:bg-white",
  brand:
    "text-white border-blue-600 bg-blue-600 hover:text-blue-600 hover:bg-white",
  brandLight:
    "text-white border-blue-400 bg-blue-400 hover:text-blue-400 hover:bg-white",
  success:
    "text-white border-green-600 bg-green-600 hover:text-green-700 hover:bg-white",
  error:
    "text-white border-red-600 bg-red-600 hover:text-red-700 hover:bg-white",
};

function ButtonInner(props) {
  return (
    <div className="flex items-center justify-center">
      {props.label}
      {props.icon && ICON_MAPS[props.icon]}
    </div>
  );
}

export function Button(props) {
  const { label, variant, size, shadow, href, icon, button } = props;
  return (
    <>
      {button ? (
        <button
          {...props}
          className={cn(
            "rounded-md transition duration-300 border inline-block",
            VARIANT_MAPS[variant],
            SIZE_MAPS[size],
            SHADOW_MAPS[shadow]
          )}
        >
          <ButtonInner label={label} icon={icon} />
        </button>
      ) : (
        <Link href={href} passHref>
          <a
            className={cn(
              "rounded-md transition duration-300 border inline-block",
              VARIANT_MAPS[variant],
              SIZE_MAPS[size],
              SHADOW_MAPS[shadow]
            )}
            {...props}
          >
            <ButtonInner label={label} icon={icon} />
          </a>
        </Link>
      )}
    </>
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
  variant: PropTypes.oneOf([
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
  /**
   * Add a helpful icon if you’re linking to a file or an external site.
   */
  icon: PropTypes.oneOf(["external", "download", false]),
  /**
   * Override’s default behaviour (i.e. to render an `<a>` hyperlink using next/link) and produces a `<button` instead.
   */
  button: PropTypes.bool,
};

Button.defaultProps = {
  variant: "primary",
  size: "auto",
  href: "",
  shadow: null,
  icon: null,
  button: null,
};

Button.variant = VARIANT_MAPS;
Button.size = SIZE_MAPS;
Button.shadow = SHADOW_MAPS;
Button.icon = ICON_MAPS;

export default Button;
