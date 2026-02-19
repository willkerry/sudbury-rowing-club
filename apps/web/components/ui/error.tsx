import { AlertOctagon, ArrowUpRight } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Alert } from "./alert";

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

export const ErrorMessage = React.forwardRef<HTMLDivElement, ErrorProps>(
  ({ children, error, label, className, ...props }, ref) => (
    <div
      aria-atomic
      className={cn("font-medium text-red-600 text-sm", className)}
      ref={ref}
      role="alert"
      {...props}
    >
      <div className="flex items-start">
        <AlertOctagon aria-hidden className="mt-0.5 mr-2 h-4 w-4 flex-none" />

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
ErrorMessage.displayName = "ErrorMessage";

export const ErrorAlert = React.forwardRef<HTMLDivElement, ErrorProps>(
  ({ error, label, className, ...props }, ref) => (
    <Alert
      className={cn("font-medium text-red-600 text-sm", className)}
      ref={ref}
      variant="destructive"
      {...props}
    >
      <ErrorMessage error={error} {...props} />
    </Alert>
  ),
);
