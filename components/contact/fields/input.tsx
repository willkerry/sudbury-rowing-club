type Props = {
  disabled?: boolean;
  id: string;
  input: {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
  };
  label: string;
  meta?: {
    invalid?: boolean;
    touched?: boolean;
  };
  placeholder?: string;
  type: string;
};

const Input = ({
  input,
  meta,
  label,
  id,
  type,
  placeholder,
  disabled,
}: Props) => (
  <div className="col-span-2 sm:col-span-1">
    <label htmlFor={id}>{label}</label>
    <input
      {...input}
      className={meta?.invalid && meta?.touched ? "invalid" : ""}
      disabled={disabled}
      id={id}
      placeholder={placeholder}
      required
      type={type}
    />
  </div>
);

export default Input;