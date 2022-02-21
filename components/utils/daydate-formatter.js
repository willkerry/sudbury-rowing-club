import PropTypes from "prop-types";

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
export default function DateFormatter({ dateString }) {
  const date = new Date(dateString);
  const output = date.toLocaleDateString("en-GB", options);
  return <time dateTime={dateString}>{output}</time>;
}

DateFormatter.propTypes = {
  dateString: PropTypes.string.isRequired,
};
