import type { VariantProps } from "class-variance-authority";
import { cn } from "lib/utils";
import { forwardRef, type InputHTMLAttributes, useId } from "react";
import {
  InputDescription,
  InputError,
  InputLabel,
  InputWrapper,
  inputVariants,
} from "./input";
import css from "./select.module.css";

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  description?: string;
  error?: string;
  label?: string;
}

const Select = forwardRef<
  HTMLSelectElement,
  VariantProps<typeof inputVariants> & SelectProps
>(({ className, description, error, id, label, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  return (
    <InputWrapper className={className}>
      <select
        aria-describedby={description && descriptionId}
        aria-errormessage={error && errorId}
        aria-invalid={!!error}
        className={cn(
          inputVariants(),
          "cursor-pointer enabled:appearance-none",
          css.select,
        )}
        data-error={!!error}
        id={inputId}
        ref={ref}
        required
        {...props}
      />

      <InputLabel id={inputId} label={label} />
      <InputDescription description={description} id={descriptionId} />
      <InputError error={error} id={errorId} />
    </InputWrapper>
  );
});
Select.displayName = "Select";

export { Select };
