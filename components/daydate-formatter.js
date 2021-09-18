import tinytime from "tinytime";

export default function DateFormatter({ dateString }) {
  const formatDate = tinytime("{dddd} {DD} {MMMM} {YYYY}").render;
  return <time dateTime={dateString}>{formatDate(new Date(dateString))}</time>;
}
