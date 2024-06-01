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

export const Error = React.forwardRef<HTMLDivElement, ErrorProps>(
  ({ children, error, label, ...props }, ref) => (
    <div
      ref={ref}
      aria-atomic
      role="alert"
      className="flex items-center font-medium text-red-600 text-sm"
      {...props}
    >
      <AlertOctagon aria-hidden className="mr-1 h-4 w-4" />

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
        error?.message
      )}

      {children}
    </div>
  ),
);
Error.displayName = "Error";
