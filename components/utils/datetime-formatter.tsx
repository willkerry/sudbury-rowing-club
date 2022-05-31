type Props = {
  dateString: string;
};

const options: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const DateTimeFormatter = ({ dateString }: Props) => {
  const date = new Date(dateString);
  const output = date.toLocaleString("en-GB", options);
  return <time dateTime={dateString}>{output}</time>;
};

export default DateTimeFormatter;
