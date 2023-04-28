import type {
  ButtonHTMLAttributes,
  ComponentProps,
  ElementType,
  ReactNode,
} from "react";

import cn from "classnames";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";
import Loading from "../loading";

type Size = "auto" | "mini" | "small" | "medium" | "large";
type Variant =
  | "primary"
  | "secondary"
  | "brand"
  | "success"
  | "error"
  | "warning";

type BaseProps = {
  children: ReactNode;
  asChild?: boolean;
  as?: ElementType;
  size?: Size;
  variant?: Variant;
  shadow?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  href?: string;
};

type Props = BaseProps &
  (string extends BaseProps["href"]
    ? ButtonHTMLAttributes<HTMLButtonElement>
    : ComponentProps<typeof Link>);

const SIZE = new Map<Size, string>([
  ["mini", "h-7 px-2 min-w-min w-18 text-xs font-medium"],
  ["small", "h-9  px-3 min-w-min w-24 text-sm"],
  ["medium", "h-10 px-4 min-w-min w-40 text-sm"],
  ["large", "h-12 px-8 min-w-min w-64 text-base"],
  ["auto", "h-10 px-4 text-sm"],
]);

const VARIANT = new Map<Variant, string>([
  [
    "primary",
    "!text-gray-600 hover:border-black hover:!text-black focus:ring-blue-100 focus:border-black focus:!text-black",
  ],
  [
    "secondary",
    "!text-white border-gray-900 bg-gray-900 hover:!text-gray-900 hover:bg-white focus:ring-blue-100 focus:!text-gray-900 focus:bg-white",
  ],
  [
    "brand",
    "!text-white border-blue-700 bg-blue-700 hover:!text-blue-700 hover:bg-white focus:ring-blue-100 focus:!text-blue-700 focus:bg-white",
  ],
  [
    "success",
    "!text-white border-green-600 bg-green-600 hover:!text-green-700 hover:bg-white focus:ring-blue-100 focus:!text-green-700 focus:bg-white",
  ],
  [
    "error",
    "!text-white border-red-600 bg-red-600 hover:!text-red-700 hover:bg-white ring-red-200 focus:ring-red-200 focus:!text-red-700 focus:bg-white",
  ],
  [
    "warning",
    "!text-white border-yellow-600 bg-yellow-600 hover:!text-yellow-700 hover:bg-white ring-yellow-200 focus:ring-yellow-200 focus:!text-yellow-700 focus:bg-white",
  ],
]);

const DISABLED = new Map<boolean, string>([
  [
    true,
    "text-gray-300 bg-gray-100 cursor-not-allowed focus:ring-none hover:text-inherit hover:border-inherit",
  ],
  [false, "cursor-pointer"],
]);

const SHADOW = new Map<boolean, string>([
  [true, "shadow-lg hover:shadow"],
  [false, ""],
]);

const getIcon = (icon: ReactNode) => {
  if (!icon) return null;
  return <Slot className="flex w-4 mr-2">{icon}</Slot>;
};

const getClassNames = (
  size: Size,
  variant: Variant,
  disabled: boolean,
  className: string,
  shadow: boolean
) =>
  cn([
    "rounded transition duration-300 border inline-block border-box focus:ring-4 focus:outline-none select-none whitespace-nowrap relative text-center leading-none disabled:hover:!text-inherit disabled:hover:border-inherit",
    VARIANT.get(variant),
    SIZE.get(size),
    DISABLED.get(!!disabled),
    SHADOW.get(shadow),
    className,
  ]);

const Button = ({
  asChild,
  as = "button",
  size = "auto",
  variant = "primary",
  className = "",
  disabled = false,
  icon,
  children,
  shadow = false,
  isLoading = false,
  href,
  ...rest
}: Props) => {
  const Component = href ? Link : as;

  return (
    <Component
      {...{
        disabled,
        href,
        className: getClassNames(size, variant, disabled, className, shadow),
        ...rest,
      }}
    >
      <div className="flex items-center justify-center w-full h-full">
        {getIcon(icon)}
        {isLoading ? <Loading /> : children}
      </div>
    </Component>
  );
};

export default Button;
