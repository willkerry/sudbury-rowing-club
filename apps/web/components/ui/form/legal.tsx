import type { FieldValues } from "react-hook-form";
import { Checkbox } from "../checkbox";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";

export const FormItemLegal = ({
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
}) => (
  <FormItem className="items-top flex gap-x-2">
    <FormControl>
      <Checkbox
        className="mt-3"
        checked={value}
        onCheckedChange={onChange}
        {...fieldProps}
      />
    </FormControl>

    <div className="grid gap-1.5">
      <FormLabel {...rest} className="leading-snug">
        {label}
      </FormLabel>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </div>
  </FormItem>
);
