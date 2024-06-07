import React from "react";
import { AlertOctagon, ArrowUpRight } from "lucide-react";

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

export const Error = React.forwardRef<HTMLDivElement, ErrorProps>(
  ({ children, error, label, ...props }, ref) => (
    <div
      ref={ref}
      aria-atomic
      role="alert"
      className="text-sm font-medium text-red-600"
      {...props}
    >
      <div className="flex items-center">
        <AlertOctagon aria-hidden className="mr-1 h-4 w-4 flex-none" />

        {label && <span className="mr-1 font-semibold">{label}</span>}

        {error && "action" in error ? (
          <p>
            {error.message}{" "}
            <a
              className="inline-flex items-center font-semibold underline"
              href={error.link}
            >
              {error.action}
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </a>
            .
          </p>
        ) : (
          <div className="line-clamp-1">{error?.message}</div>
        )}
      </div>

      {children && <div className="mt-2 text-xs">{children}</div>}
    </div>
  ),
);
Error.displayName = "Error";
