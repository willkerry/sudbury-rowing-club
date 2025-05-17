import { Slot, Slottable } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "lib/utils";
import { Loader2 } from "lucide-react";
import * as React from "react";

const buttonVariants = cva(
  "not-prose relative inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium text-sm ring-offset-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
  {
    variants: {
      variant: {
        default: "bg-black text-gray-100 hover:bg-black/80",
        secondary: "border bg-white text-gray-900 hover:bg-gray-100",
        tertiary: "border bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive: "bg-red-600 text-white hover:bg-red-500",
        brand: "bg-blue-700 text-white hover:bg-blue-500",
        success: "bg-green-600 text-white hover:bg-green-500",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-gray-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 px-2 font-medium text-xs",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
      shadow: {
        true: "shadow-xl transition-shadow hover:shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      shadow,
      size,
      asChild = false,
      icon,
      loading,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className, shadow }))}
        disabled={loading}
        ref={ref}
        {...props}
      >
        <Slottable>{children}</Slottable>
        <Slottable>
          <Slot aria-hidden className="ml-2 w-4">
            {loading ? <Loader2 className="animate-spin" /> : icon}
          </Slot>
        </Slottable>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
