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
  dateString: string | number | Date;
  format?: DateFormatPresets;
  timeZone?: Intl.DateTimeFormatOptions["timeZone"];
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

const DateFormatter = ({
  dateString,
  format,
  timeZone = Intl?.DateTimeFormat().resolvedOptions().timeZone,
  ...props
}: Props) => (
  <time dateTime={dateString.toString()} {...props}>
    {Intl.DateTimeFormat("en-GB", {
      timeZone,
      ...defaultOptions.get(format || "default"),
    }).format(new Date(dateString))}
  </time>
);

DateFormatter.defaultProps = {
  format: "default",
};

export default DateFormatter;
