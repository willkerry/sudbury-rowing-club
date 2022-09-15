import { useEffect, useState } from "react";

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
  const [output, setOutput] = useState("");
  useEffect(() => {
    const date = new Date(dateString);
    setOutput(date.toLocaleDateString("en-GB", options));
  }, []);
  return <time dateTime={dateString}>{output}</time>;
};

export default DateTimeFormatter;
