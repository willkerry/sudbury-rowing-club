import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "lib/utils";
import { forwardRef, type InputHTMLAttributes, useId } from "react";
import { Label } from "./label";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  description?: string;
  error?: string;
  inputClassName?: string;
  label?: string;
}

export const inputVariants = cva(
  [
    "peer flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-gray-500 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    "data-[error=true]:border-2 data-[error=true]:border-red-600 data-[error=true]:bg-red-50",
  ],
  {
    variants: {
      loading: {
        true: "animate-pulse bg-gray-100 ease-in-out",
      },
      size: {
        lg: "h-12 text-base",
        md: "h-10 text-sm",
        sm: "h-8 text-xs",
      },
    },
  },
);

export const InputDescription = ({
  id,
  description,
}: {
  id: string;
  description?: string;
}) => {
  if (!description) return null;

  return (
    <div className="mt-1 text-gray-600 text-xs" id={id}>
      {description}
    </div>
  );
};

export const InputError = ({ id, error }: { id: string; error?: string }) => {
  if (!error) return null;

  return (
    <div
      aria-atomic
      className="mt-1 font-medium text-red-700 text-xs"
      id={id}
      role="alert"
    >
      {error}
    </div>
  );
};

export const InputLabel = ({ id, label }: { id: string; label?: string }) => {
  if (!label) return null;

  return (
    <Label
      className="-order-1 pb-2 after:hidden after:text-red-600 after:content-['＊'] peer-required:after:inline"
      htmlFor={id}
    >
      {label}
    </Label>
  );
};

export const InputWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("relative flex flex-col", className)}>{children}</div>;

const Input = forwardRef<
  HTMLInputElement,
  VariantProps<typeof inputVariants> & InputProps
>(
  (
    {
      className,
      description,
      error,
      id,
      inputClassName,
      label,
      type,
      ...props
    },
    ref,
  ) => {
    const fallbackId = useId();
    const inputId = id || fallbackId;

    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    return (
      <InputWrapper className={className}>
        <input
          aria-describedby={description && descriptionId}
          aria-errormessage={error && errorId}
          aria-invalid={!!error}
          className={cn(inputVariants(props), inputClassName)}
          data-error={!!error}
          formNoValidate
          id={inputId}
          ref={ref}
          type={type}
          {...props}
        />

        <InputLabel id={inputId} label={label} />
        <InputDescription description={description} id={descriptionId} />
        <InputError error={error} id={errorId} />
      </InputWrapper>
    );
  },
);
Input.displayName = "Input";

export { Input };
