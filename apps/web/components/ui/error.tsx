import { cn } from "@/lib/utils";
import { AlertOctagon, ArrowUpRight } from "lucide-react";
import React from "react";

type ErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
  error:
    | {
        message: string;
      }
    | {
        message: string;
        action: string;
        link: string;
      };
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: TODO: fix
export const Error = React.forwardRef<HTMLDivElement, ErrorProps>(
  ({ children, error, label, className, ...props }, ref) => (
    <div
      ref={ref}
      aria-atomic
      role="alert"
      className={cn("text-sm font-medium text-red-600", className)}
      {...props}
    >
      <div className="flex items-start">
        <AlertOctagon aria-hidden className="mr-2 mt-0.5 h-4 w-4 flex-none" />

        <div>
          {label && <span className="mr-2 font-semibold">{label}</span>}

          <span>{error?.message} </span>

          {error && "action" in error && (
            <a
              className="inline-flex items-center font-semibold underline"
              href={error.link}
            >
              {error.action}
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </a>
          )}

          {children && (
            <div className="prose prose-red mt-2 prose-a:underline">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  ),
);
Error.displayName = "Error";
