import { toLondonDate, toLondonHour } from "./london-time";
import type { ForecastDay } from "./to-forecast-days";

export const EVENING_CUTOFF_HOUR = 20;

export const selectDefaultDayIndex = (
  days: ForecastDay[],
  now: Date,
): number => {
  const todayIndex = days.findIndex((day) => day.date === toLondonDate(now));

  if (todayIndex === -1) return 0;

  if (toLondonHour(now) < EVENING_CUTOFF_HOUR) return todayIndex;

  return Math.min(todayIndex + 1, days.length - 1);
};
