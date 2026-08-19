import { type ForecastDay, toLondonDate } from "./to-forecast-days";

export const EVENING_CUTOFF_HOUR = 20;

const londonHourFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/London",
});

export const selectDefaultDayIndex = (
  days: ForecastDay[],
  now: Date,
): number => {
  const todayIndex = days.findIndex((day) => day.date === toLondonDate(now));

  if (todayIndex === -1) return 0;

  const hour = Number(londonHourFormatter.format(now));

  if (hour < EVENING_CUTOFF_HOUR) return todayIndex;

  return Math.min(todayIndex + 1, days.length - 1);
};
