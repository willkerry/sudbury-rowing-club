import { FormControl, FormItem, FormLabel } from "./form";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const BooleanRadioGroup = ({
  value,
  onValueChange,
}: {
  value?: boolean;
  onValueChange: (value: boolean) => void;
}) => {
  return (
    <RadioGroup
      value={value === undefined ? undefined : value ? "yes" : "no"}
      onValueChange={(value) => onValueChange(value === "yes")}
      className="flex flex-wrap gap-6"
    >
      <FormItem className="flex items-center space-x-2 space-y-0">
        <FormControl>
          <RadioGroupItem value="yes" />
        </FormControl>
        <FormLabel>Yes</FormLabel>
      </FormItem>
      <FormItem className="flex items-center space-x-2 space-y-0">
        <FormControl>
          <RadioGroupItem value="no" />
        </FormControl>
        <FormLabel>No</FormLabel>
      </FormItem>
    </RadioGroup>
  );
};
BooleanRadioGroup.displayName = "BooleanRadioGroup";

export { BooleanRadioGroup };
