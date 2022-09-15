import { useEffect, useState } from "react";

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
  const [output, setOutput] = useState("");
  useEffect(() => {
    const date = new Date(dateString);
    setOutput(date.toLocaleDateString("en-GB", options));
  }, []);
  return <time dateTime={dateString.toString()}>{output}</time>;
};

export default DayDateFormatter;
