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
      className="text-red-600 font-medium text-sm flex items-center"
      {...props}
    >
      <AlertOctagon aria-hidden className="w-4 h-4 mr-1" />

      {label && <span className="mr-1 font-semibold">{label}</span>}

      {error && "action" in error ? (
        <p>
          {error.message}{" "}
          <a
            className="underline font-semibold inline-flex items-center"
            href={error.link}
          >
            {error.action}
            <ArrowUpRight aria-hidden className="w-4 h-4" />
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
