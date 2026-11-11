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
  description?: string;
  error?: string;
  inputClassName?: string;
  label?: string;
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
          aria-describedby={description && descriptionId}
          aria-errormessage={error && errorId}
          aria-invalid={!!error}
          className={cn(inputVariants(), inputClassName)}
          data-error={!!error}
          id={inputId}
          ref={ref}
          {...props}
        />

        <InputLabel id={inputId} label={label} />
        <InputDescription description={description} id={descriptionId} />
        <InputError error={error} id={errorId} />
      </InputWrapper>
    );
  },
);
TextArea.displayName = "TextArea";

export { TextArea };
