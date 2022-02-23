import PropTypes from "prop-types";

export default function Select({
  input,
  meta,
  label,
  id,
  options,
  disabled,
  pristine,
}) {
  const optionsIterated = options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div className="col-span-2">
      <label htmlFor={id}>{label}</label>
      <select
        {...input}
        className={meta.invalid && !pristine ? "invalid" : ""}
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
}
Select.propTypes = {
  disabled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }).isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    invalid: PropTypes.bool,
  }).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  pristine: PropTypes.bool.isRequired,
};
