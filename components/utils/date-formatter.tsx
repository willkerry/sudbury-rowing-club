import { useState } from "react";

type Props = {
  dateString: string | Date;
  format?: "default" | "long" | "short" | "numeric" | "time" | "year";
};

const defaultOptions: Map<string, Intl.DateTimeFormatOptions> = new Map([
  ["default", { year: "numeric", month: "long", day: "numeric" }],
  ["long", { weekday: "long", year: "numeric", month: "long", day: "numeric" }],
  ["short", { year: "numeric", month: "short", day: "numeric" }],
  ["numeric", { year: "numeric", month: "numeric", day: "numeric" }],
  [
    "time",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
  ],
  ["year", { year: "numeric" }],
]);

const DateFormatter = ({ dateString, format }: Props) => {
  const [dateObj] = useState(new Date(dateString));
  return (
    <time dateTime={dateObj.toString()}>
      {dateObj.toLocaleDateString(
        "en-GB",
        defaultOptions.get(format || "default")
      )}
    </time>
  );
};

DateFormatter.defaultProps = {
  format: "default",
};

export default DateFormatter;
