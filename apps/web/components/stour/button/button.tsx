import type {
  ButtonHTMLAttributes,
  ComponentProps,
  ElementType,
  ReactNode,
} from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import cn from "clsx";
import Loading from "../loading";

const buttonVariants = cva(
  "rounded-sm transition duration-300 border inline-block border-box focus:ring-4 focus:outline-none select-none whitespace-nowrap relative text-center leading-none disabled:hover:!text-inherit disabled:hover:border-inherit",
  {
    variants: {
      variant: {
        primary:
          "!text-gray-600 hover:border-black hover:!text-black focus:ring-blue-100 focus:border-black focus:!text-black",
        secondary:
          "!text-white border-gray-900 bg-gray-900 hover:!text-gray-900 hover:bg-white focus:ring-blue-100 focus:!text-gray-900 focus:bg-white",
        brand:
          "!text-blue-500 border-blue-200 hover:border-black hover:!text-black focus:ring-blue-100 focus:border-black focus:!text-black",
        success:
          "!text-white border-green-600 bg-green-600 hover:!text-green-700 hover:bg-white focus:ring-blue-100 focus:!text-green-700 focus:bg-white",
        error:
          "!text-white border-red-600 bg-red-600 hover:!text-red-700 hover:bg-white ring-red-200 focus:ring-red-200 focus:!text-red-700 focus:bg-white",
        warning:
          "!text-white border-yellow-600 bg-yellow-600 hover:!text-yellow-700 hover:bg-white ring-yellow-200 focus:ring-yellow-200 focus:!text-yellow-700 focus:bg-white",
      },
      size: {
        mini: "h-7 px-2 min-w-min w-18 text-xs font-medium",
        small: "h-9  px-3 min-w-min w-24 text-sm",
        medium: "h-10 px-4 min-w-min w-40 text-sm",
        large: "h-12 px-8 min-w-min w-64 text-base",
        auto: "h-10 px-4 text-sm",
      },
      disabled: {
        true: "text-gray-300 bg-gray-100 cursor-not-allowed focus:ring-none hover:text-inherit hover:border-inherit",
        false: "cursor-pointer",
      },
      shadow: {
        true: "shadow-lg shadow-gray-100 hover:shadow-sm",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "auto",
      disabled: false,
      shadow: false,
    },
  },
);

type BaseButtonProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  as?: ElementType;
  icon?: ReactNode;
  isLoading?: boolean;
  href?: string;
};

type ButtonProps = BaseButtonProps &
  (string extends BaseButtonProps["href"]
    ? ButtonHTMLAttributes<HTMLButtonElement>
    : ComponentProps<typeof Link>);

const getIcon = (icon: ReactNode) => {
  if (!icon) return null;
  return <Slot className="mr-2 flex w-4">{icon}</Slot>;
};

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
}: ButtonProps) => {
  const Component = href ? Link : as;

  return (
    <Component
      {...{
        disabled,
        href,
        className: cn([
          buttonVariants({ variant, size, disabled, shadow }),
          className,
        ]),
        ...rest,
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        {getIcon(icon)}
        {isLoading ? <Loading /> : children}
      </div>
    </Component>
  );
};

export default Button;
