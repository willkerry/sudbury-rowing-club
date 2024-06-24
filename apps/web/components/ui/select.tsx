import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "lib/utils";
import {
  InputDescription,
  InputError,
  InputLabel,
  InputWrapper,
  inputVariants,
} from "./input";
import css from "./select.module.css";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  description?: string;
  error?: string;
}

const Select = forwardRef<
  HTMLSelectElement,
  VariantProps<typeof inputVariants> & SelectProps
>(({ className, description, error, id, label, ...props }, ref) => {
  const inputId = id || useId();
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  return (
    <InputWrapper className={className}>
      <select
        data-error={!!error}
        className={cn(
          inputVariants(),
          "cursor-pointer enabled:appearance-none",
          css.select,
        )}
        ref={ref}
        id={inputId}
        aria-describedby={description && descriptionId}
        aria-errormessage={error && errorId}
        aria-invalid={!!error}
        required
        {...props}
      />

      <InputLabel id={inputId} label={label} />
      <InputDescription id={descriptionId} description={description} />
      <InputError id={errorId} error={error} />
    </InputWrapper>
  );
});
Select.displayName = "Select";

export { Select };
