import tinytime from "tinytime";
import PropTypes from "prop-types";

export default function DateTimeFormatter({ dateString }) {
  const formatDate = tinytime("{DD} {MM} {YYYY} at {h}:{mm} {a}").render;
  return <time dateTime={dateString}>{formatDate(new Date(dateString))}</time>;
}

DateTimeFormatter.propTypes = {
  dateString: PropTypes.string.isRequired,
};
