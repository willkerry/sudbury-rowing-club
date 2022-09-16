import { useState } from "react";

type DateFormatPresets =
  | "default"
  | "long"
  | "short"
  | "numeric"
  | "time"
  | "year";

type Props = {
  dateString: string | Date;
  format?: DateFormatPresets;
} & React.HTMLAttributes<HTMLTimeElement>;

const defaultOptions: Map<DateFormatPresets, Intl.DateTimeFormatOptions> =
  new Map([
    ["default", { year: "numeric", month: "long", day: "numeric" }],
    [
      "long",
      { year: "numeric", month: "long", day: "numeric", weekday: "long" },
    ],
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

const DateFormatter = ({ dateString, format, ...props }: Props) => {
  const [dateObj] = useState(new Date(dateString));
  return (
    <time dateTime={dateObj.toString()} {...props}>
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
