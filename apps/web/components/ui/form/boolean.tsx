import type { FieldValues } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../form";
import { RadioGroup, RadioGroupItem } from "../radio-group";

export const FormItemBoolean = ({
  field: { value, onChange, ...fieldProps },
  label,
  trueLabel = "Yes",
  falseLabel = "No",
  nullLabel = "I don’t know",
  allowNull = false,
  ...rest
}: {
  field: FieldValues;
  label: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  trueLabel?: React.ReactNode;
  falseLabel?: React.ReactNode;
  allowNull?: boolean;
  nullLabel?: React.ReactNode;
}) => {
  const stringifyValue = (value: boolean | undefined) => {
    if (value === null) {
      return "null";
    }

    if (value === undefined) {
      return "";
    }

    return value ? "yes" : "no";
  };

  const valueChangeHanlder = (value: string) => {
    if (value === "yes") {
      onChange(true);
      return;
    }

    if (value === "no") {
      onChange(false);
      return;
    }

    if (allowNull) {
      onChange(null);
      return;
    }

    onChange(undefined);
  };

  return (
    <FormItem>
      <FormLabel {...rest}>{label}</FormLabel>

      <FormControl>
        <RadioGroup
          value={stringifyValue(value)}
          onValueChange={valueChangeHanlder}
          {...fieldProps}
          className="flex flex-wrap gap-6"
        >
          <FormItem className="flex items-center space-x-2 space-y-0">
            <FormControl>
              <RadioGroupItem value="yes" />
            </FormControl>
            <FormLabel>{trueLabel}</FormLabel>
          </FormItem>
          <FormItem className="flex items-center space-x-2 space-y-0">
            <FormControl>
              <RadioGroupItem value="no" />
            </FormControl>
            <FormLabel>{falseLabel}</FormLabel>
          </FormItem>

          {allowNull && (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <RadioGroupItem value="null" />
              </FormControl>
              <FormLabel>{nullLabel}</FormLabel>
            </FormItem>
          )}
        </RadioGroup>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
