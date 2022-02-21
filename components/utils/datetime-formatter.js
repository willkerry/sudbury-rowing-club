import PropTypes from "prop-types";

const options = { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric" };

export default function DateFormatter({ dateString }) {
  const date = new Date(dateString);
  const output = date.toLocaleString("en-GB", options);
  return <time dateTime={dateString}>{output}</time>;
}

DateFormatter.propTypes = {
  dateString: PropTypes.string.isRequired,
};
