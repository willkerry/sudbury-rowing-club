type Props = {
  dateString: string;
};

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
};

const YearFormatter = ({ dateString }: Props) => {
  const date = new Date(dateString);
  const output = date.toLocaleString("en-GB", options);
  return <time dateTime={dateString}>{output}</time>;
};

export default YearFormatter;
