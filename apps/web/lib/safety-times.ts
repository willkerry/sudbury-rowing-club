import { toLondonDate } from "./forecast/london-time";

const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  timeZone: "Europe/London",
});

const dayFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "Europe/London",
});

const relativeFormatter = new Intl.RelativeTimeFormat("en-GB", {
  numeric: "auto",
  style: "short",
});

/** "today at 20:30", or "13 Nov at 20:30" for any other day. */
export const formatWhen = (date: Date, now: Date): string => {
  const time = timeFormatter.format(date);
  const day =
    toLondonDate(date) === toLondonDate(now)
      ? "today"
      : dayFormatter.format(date);

  return `${day} at ${time}`;
};

/** "just now", "3 min ago", "2 hr ago" or "3 days ago". */
export const formatAgo = (date: Date, now: Date): string => {
  const minutes = Math.floor((now.getTime() - date.getTime()) / MS_PER_MINUTE);

  if (minutes < 1) return "just now";
  if (minutes < MINUTES_PER_HOUR)
    return relativeFormatter.format(-minutes, "minute");

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  if (hours < HOURS_PER_DAY) return relativeFormatter.format(-hours, "hour");

  return relativeFormatter.format(-Math.floor(hours / HOURS_PER_DAY), "day");
};
