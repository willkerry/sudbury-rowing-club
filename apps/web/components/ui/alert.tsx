import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "lib/utils";
import * as React from "react";

const alertVariants = cva(
  "relative w-full rounded-sm border border-gray-200 p-3 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-3 [&>svg]:left-3 [&>svg]:text-gray-950 [&>svg~*]:pl-6",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-950",
        warn: "border-yellow-500/50 bg-yellow-50 text-yellow-900",
        destructive: "border-red-500/50 text-red-500",
        success: "border-green-500/50 bg-green-50 text-green-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold text-sm leading-none", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:my-0 [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
