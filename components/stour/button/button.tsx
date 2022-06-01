import React from "react";
import cn from "classnames";
import { Slot } from "@radix-ui/react-slot";
import Loading from "../loading";

type Props = {
  children: React.ReactNode;
  asChild?: boolean;
  as?: React.ElementType;
  size?: "auto" | "mini" | "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "brand" | "success" | "error" | "warning";
  shadow?: boolean;
  disabled: boolean;
  className?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
};

const SIZE = {
  mini: "h-7 px-2 min-w-min w-18 text-xs font-medium",
  small: "h-9  px-3 min-w-min w-24 text-sm",
  medium: "h-10 px-4 min-w-min w-40 text-sm",
  large: "h-12 px-8 min-w-min w-64 text-base",
  auto: "h-10 px-4 text-sm",
};
const VARIANT = {
  primary: "!text-gray-600 hover:border-black hover:!text-black ring-gray-200",
  secondary:
    "!text-white border-gray-900 bg-gray-900 hover:!text-gray-900 hover:bg-white ring-gray-200",
  brand:
    "!text-white border-blue-700 bg-blue-700 hover:!text-blue-700 hover:bg-white ring-blue-200",
  success:
    "!text-white border-green-600 bg-green-600 hover:!text-green-700 hover:bg-white ring-green-200",
  error:
    "!text-white border-red-600 bg-red-600 hover:!text-red-700 hover:bg-white ring-red-200",
  warning:
    "!text-white border-yellow-600 bg-yellow-600 hover:!text-yellow-700 hover:bg-white ring-yellow-200",
};
const disabledClassNames =
  "text-gray-300 bg-gray-100 cursor-not-allowed focus:ring-none hover:text-inherit hover:border-inherit";

const Button = ({
  asChild,
  as = "button",
  size = "auto",
  variant = "primary",
  className,
  disabled,
  icon,
  children,
  shadow = false,
  isLoading = false,
  ...rest
}: Props & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const Comp = as;
  const hasIcon = icon !== null;
  const baseClassNames: string =
    "rounded transition duration-300 border inline-block border-box" +
    "focus:ring-2 focus:ring-offset-2 focus:outline-none select-none" +
    "whitespace-nowrap relative text-center leading-none" +
    "disabled:hover:!text-inherit disabled:hover:border-inherit";

  const classNames: string = cn([
    baseClassNames,
    VARIANT[variant],
    SIZE[size],
    disabled ? disabledClassNames : "cursor-pointer",
    shadow && "shadow-lg hover:shadow",
    className,
  ]);

  return (
    <Comp {...rest} className={classNames} disabled={disabled}>
      <div className="flex items-center justify-center w-full h-full">
        {hasIcon && <Slot className="flex w-4 mr-2">{icon}</Slot>}
        {isLoading ? <Loading /> : children}
      </div>
    </Comp>
  );
};

export default Button;