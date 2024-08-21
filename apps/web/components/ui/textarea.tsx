import { cn } from "lib/utils";
import { forwardRef, useId } from "react";
import TextAreaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";
import {
  InputDescription,
  InputError,
  InputLabel,
  InputWrapper,
  inputVariants,
} from "./input";

export interface TextAreaProps extends TextareaAutosizeProps {
  label?: string;
  error?: string;
  description?: string;
  inputClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, description, error, id, inputClassName, label, ...props },
    ref,
  ) => {
    const fallbackId = useId();
    const inputId = id || fallbackId;

    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    return (
      <InputWrapper className={className}>
        <TextAreaAutosize
          className={cn(inputVariants(), inputClassName)}
          data-error={!!error}
          ref={ref}
          id={inputId}
          aria-describedby={description && descriptionId}
          aria-errormessage={error && errorId}
          aria-invalid={!!error}
          {...props}
        />

        <InputLabel id={inputId} label={label} />
        <InputDescription id={descriptionId} description={description} />
        <InputError id={errorId} error={error} />
      </InputWrapper>
    );
  },
);
TextArea.displayName = "TextArea";

export { TextArea };
