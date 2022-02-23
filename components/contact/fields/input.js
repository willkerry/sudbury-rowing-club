import PropTypes from "prop-types";

export default function Input({ input, meta, label, id, type, placeholder, disabled }) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <label htmlFor={id}>{label}</label>
      <input
        {...input}
        className={meta.invalid && meta.touched ? "invalid" : ""}
        disabled={disabled}
        id={id}
        placeholder={placeholder}
        required
        type={type}
      />
    </div>
  );
}
Input.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    invalid: PropTypes.bool,
    touched: PropTypes.bool,
  }).isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired,
};
Input.defaultProps = {
  disabled: false,
  placeholder: "",
};
