import tinytime from "tinytime";
import PropTypes from "prop-types";

export default function DayDateFormatter({ dateString }) {
  const formatDate = tinytime("{dddd} {DD} {MMMM} {YYYY}").render;
  return <time dateTime={dateString}>{formatDate(new Date(dateString))}</time>;
}

DayDateFormatter.propTypes = {
  dateString: PropTypes.string.isRequired,
};
