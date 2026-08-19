const WEEKEND = [0, 6];

/**
 * Returns true when a London-local calendar date string (YYYY-MM-DD) falls on
 * a Saturday or Sunday. Parsing a YYYY-MM-DD string yields UTC midnight; the
 * day-of-week is the same across all timezones for a whole-day date, so
 * getUTCDay() on the already-London date string is correct.
 */
export const isWeekend = (date: string) =>
  WEEKEND.includes(new Date(date).getUTCDay());
