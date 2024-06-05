import { ukPhoneMask } from "@/lib/masks/uk-phone";
import { useMaskito } from "@maskito/react";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";

export const FormItemPhone = ({
  field: { value, onChange, ...fieldProps },
  label,
  description,
  ...rest
}: {
  field: FieldValues;
  label: React.ReactNode;
  description?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) => {
  const ref = useMaskito({ options: ukPhoneMask });
  const [nonUK, setNonUK] = useState(false);

  return (
    <FormItem>
      <FormLabel {...rest}>Second contact’s other phone number</FormLabel>

      <FormControl>
        {nonUK ? (
          <Input {...fieldProps} type="tel" onChange={onChange} />
        ) : (
          <Input
            {...fieldProps}
            type="tel"
            ref={ref}
            value={value}
            onInput={onChange}
          />
        )}
      </FormControl>
      <button
        type="button"
        className="font-medium text-blue-500 text-xs underline hover:no-underline"
        onClick={() => setNonUK((value) => !value)}
      >
        {nonUK ? "Restrict to UK numbers" : "Allow international numbers"}
      </button>

      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
