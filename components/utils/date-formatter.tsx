type DateFormatPresets =
  | "default"
  | "long"
  | "short"
  | "numeric"
  | "time"
  | "year"
  | "month"
  | "weekday"
  | "shortWeekday";

type Props = {
  dateString: string | Date;
  format?: DateFormatPresets;
} & React.HTMLAttributes<HTMLTimeElement>;

const defaultOptions: Map<DateFormatPresets, Intl.DateTimeFormatOptions> =
  new Map([
    ["default", { day: "numeric", month: "long", year: "numeric" }],
    [
      "long",
      { day: "numeric", month: "long", weekday: "long", year: "numeric" },
    ],
    ["short", { day: "numeric", month: "short", year: "numeric" }],
    ["numeric", { day: "numeric", month: "numeric", year: "numeric" }],
    [
      "time",
      {
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        month: "short",
        year: "numeric",
      },
    ],
    ["year", { year: "numeric" }],
    ["month", { month: "long" }],
    ["weekday", { weekday: "long" }],
    ["shortWeekday", { weekday: "short" }],
  ]);

const DateFormatter = ({ dateString, format, ...props }: Props) => {
  const dateObj = new Date(dateString);
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
