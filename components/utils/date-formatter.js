import tinytime from "tinytime";
import PropTypes from "prop-types";

export default function DateFormatter({ dateString }) {
  const formatDate = tinytime("{DD} {MMMM} {YYYY}").render;
  return <time dateTime={dateString}>{formatDate(new Date(dateString))}</time>;
}

DateFormatter.propTypes = {
  dateString: PropTypes.string.isRequired,
};
