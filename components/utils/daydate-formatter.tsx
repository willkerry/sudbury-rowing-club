type Props = {
  dateString: string | Date;
};

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

const DayDateFormatter = ({ dateString }: Props) => {
  const date = new Date(dateString);
  const output = date.toLocaleString("en-GB", options);
  return <time dateTime={dateString.toString()}>{output}</time>;
};

export default DayDateFormatter;
