type Props = {
  disabled?: boolean;
  id: string;
  input: {
    value: string;
  };
  label: string;
  meta?: {
    invalid?: boolean;
  };
  options: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  pristine: boolean;
  hidden: boolean;
};

/**
 * Provides a simple select field with automatic best-practice label syntax and
 * array-based options.
 */
const Select = ({
  input,
  meta,
  label,
  id,
  options,
  disabled,
  pristine,
  hidden,
}: Props) => {
  const optionsIterated = options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div className="col-span-2" hidden={hidden}>
      <label htmlFor={id}>{label}</label>
      <select
        {...input}
        className={meta?.invalid && !pristine ? "invalid" : ""}
        disabled={disabled}
        id={id}
        required
      >
        <option disabled hidden value="default">
          Select an officer
        </option>
        {optionsIterated}
      </select>
    </div>
  );
};

export default Select;
