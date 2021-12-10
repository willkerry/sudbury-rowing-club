import cn from "classnames";
import Link from "next/link";

const SIZE_MAPS = {
  mini: "h-8 px-2 min-w-min w-18 text-xs",
  small: "h-9  px-3 min-w-min w-24 text-sm",
  medium: "h-10 px-4 min-w-min w-40 text-sm",
  large: "h-12 px-8 min-w-min w-64 text-base",
  auto: "h-10 px-4 text-sm",
};
const ICON_SIZE_MAPS = {
  mini: "w-2.5 h-2.5",
  small: "w-3 h-3",
  medium: "w-3 h-3",
  large: "w-4 h-4",
  auto: "w-3.5 h-3.5",
};
const VARIANT_MAPS = {
  primary: "!text-gray-600 hover:border-black hover:!text-black",
  secondary:
    "!text-white border-gray-900 bg-gray-900 hover:!text-gray-900 hover:bg-white",
  brandDark:
    "!text-white border-blue-800 bg-blue-800 hover:!text-blue-800 hover:bg-white",
  brand:
    "!text-white border-blue-600 bg-blue-600 hover:!text-blue-600 hover:bg-white",
  brandLight:
    "text-white border-blue-400 bg-blue-400 hover:text-blue-400 hover:bg-white",
  success:
    "text-white border-green-600 bg-green-600 hover:text-green-700 hover:bg-white",
  error:
    "text-white !text-white border-red-600 bg-red-600 hover:!text-red-700 hover:bg-white",
  disabled: "text-gray-300 bg-gray-100 cursor-not-allowed",
};
const LEFT_ICON_PADDING_MAPS = {
  mini: "pl-5",
  small: "pl-5",
  medium: "pl-2",
  large: null,
  auto: "pl-5",
};
const RIGHT_ICON_PADDING_MAPS = {
  mini: "pr-5",
  small: "pr-5",
  medium: "pr-2",
  large: null,
  auto: "pr-5 ",
};

function Icon({ iconLeft, iconRight, size }) {
  const iconClass = "absolute flex items-center -translate-y-1/2 top-1/2";
  return (
    (iconLeft || iconRight) && (
      <span
        className={cn(
          iconClass,
          ICON_SIZE_MAPS[size],
          iconRight && "left-auto right-2.5",
          iconLeft && "right-auto left-2.5"
        )}
      >
        {iconLeft || iconRight}
      </span>
    )
  );
}

export function Button(props) {
  const {
    variant,
    size,
    shadow,
    href,
    children,
    disabled,
    iconLeft,
    iconRight,
  } = props;

  const baseStyles =
    "rounded transition duration-300 border inline-block border-box select-none whitespace-nowrap relative text-center leading-none";
  const buttonClassName = cn(
    baseStyles,
    SIZE_MAPS[size],
    shadow && "shadow-lg hover:shadow",
    !disabled ? VARIANT_MAPS[variant] : VARIANT_MAPS["disabled"]
  );
  function ButtonInner(props) {
    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center text-center h-full",
          iconLeft && LEFT_ICON_PADDING_MAPS[size],
          iconRight && RIGHT_ICON_PADDING_MAPS[size]
        )}
      >
        {props.label}
      </div>
    );
  }
  return props.as === "button" ? (
    <button {...props} className={buttonClassName}>
      <ButtonInner label={children} />
      {(iconLeft || iconRight) && (
        <Icon iconLeft={iconLeft} size={size} iconRight={iconRight} />
      )}
    </button>
  ) : (
    <Link href={href} passHref>
      <a className={buttonClassName}>
        <ButtonInner label={children} />
        {(iconLeft || iconRight) && (
          <Icon iconLeft={iconLeft} size={size} iconRight={iconRight} />
        )}
      </a>
    </Link>
  );
}

Button.defaultProps = {
  variant: "primary",
  size: "auto",
  href: "",
  shadow: null,
  button: null,
};

Button.variant = VARIANT_MAPS;
Button.size = SIZE_MAPS;

export default Button;
