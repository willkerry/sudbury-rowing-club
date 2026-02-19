import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "lib/utils";
import { Loader2 } from "lucide-react";
import { Slot as SlotPrimitive } from "radix-ui";
import { forwardRef } from "react";

const buttonVariants = cva(
  "not-prose relative inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium text-sm ring-offset-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      shadow: {
        true: "shadow-xl transition-shadow hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        icon: "h-10 w-10",
        lg: "h-11 px-8",
        sm: "h-9 px-3",
        xs: "h-7 px-2 font-medium text-xs",
      },
      variant: {
        brand: "bg-blue-700 text-white hover:bg-blue-500",
        default: "bg-black text-gray-100 hover:bg-black/80",
        destructive: "bg-red-600 text-white hover:bg-red-500",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-gray-900 underline-offset-4 hover:underline",
        secondary: "border bg-white text-gray-900 hover:bg-gray-100",
        success: "bg-green-600 text-white hover:bg-green-500",
        tertiary: "border bg-gray-100 text-gray-900 hover:bg-gray-200",
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
    const Comp = asChild ? SlotPrimitive.Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className, shadow }))}
        disabled={loading}
        ref={ref}
        {...props}
      >
        <SlotPrimitive.Slottable>{children}</SlotPrimitive.Slottable>
        <SlotPrimitive.Slottable>
          <SlotPrimitive.Slot aria-hidden className="ml-2 w-4">
            {loading ? <Loader2 className="animate-spin" /> : icon}
          </SlotPrimitive.Slot>
        </SlotPrimitive.Slottable>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
