import { useEffect, useState } from "react";

type Props = {
  dateString: string | Date;
};

const options: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

const DateFormatter = ({ dateString }: Props) => {
  const [output, setOutput] = useState("");
  useEffect(() => {
    const date = new Date(dateString);
    setOutput(date.toLocaleDateString("en-GB", options));
  }, []);
  return <time dateTime={dateString.toString()}>{output}</time>;
};

export default DateFormatter;
