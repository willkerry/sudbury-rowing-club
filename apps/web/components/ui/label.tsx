"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const RequiredIndicator = () => (
  <span className="absolute inset-y-0 -left-3.5 flex items-center text-red-600">
    <span aria-hidden>＊</span>
    <span className="sr-only">(Required)</span>
  </span>
);

type LabelProps = React.ComponentPropsWithoutRef<"label"> &
  VariantProps<typeof labelVariants> & {
    required?: boolean;
  };

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor / wrapping is supplied by consumers
    <label
      className={cn(labelVariants(), "relative", className)}
      ref={ref}
      {...props}
    >
      {children}
      {required && <RequiredIndicator />}
    </label>
  ),
);
Label.displayName = "Label";

export { Label };
