import cn from "clsx";
import type { InputHTMLAttributes, LabelHTMLAttributes } from "react";

type Props = {
  disabled?: InputHTMLAttributes<HTMLInputElement>["disabled"];
  id: InputHTMLAttributes<HTMLInputElement>["id"];
  input: {
    onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
    value: InputHTMLAttributes<HTMLInputElement>["value"];
  };
  label: LabelHTMLAttributes<HTMLLabelElement>["children"];
  meta?: {
    invalid?: boolean;
    touched?: boolean;
  };
  placeholder?: InputHTMLAttributes<HTMLInputElement>["placeholder"];
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  inputClassName?: string;
  instruction?: string;
  hint?: string;
};

/**
 * Provides a simple input field with automatic best-practice labels.
 */
const Input = ({
  input,
  meta,
  label,
  id,
  type,
  placeholder,
  disabled,
  inputClassName,
  instruction,
  hint,
}: Props) => (
  <div className="col-span-2 sm:col-span-1">
    <label htmlFor={id}>{label}</label>

    {instruction && <p className="my-1 text-gray-900 text-sm">{instruction}</p>}

    <input
      {...input}
      className={cn(
        inputClassName,
        meta?.invalid && meta?.touched ? "invalid" : "",
      )}
      disabled={disabled}
      id={id}
      placeholder={placeholder}
      required
      type={type}
    />

    {hint && <p className="my-1 text-gray-700 text-xs">{hint}</p>}
  </div>
);

export default Input;
