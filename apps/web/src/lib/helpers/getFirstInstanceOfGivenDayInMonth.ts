/**
 * For a given year, month, and day of the week, return the first instance of that
 * day in that month of that year.
 */
export const getFirstInstanceOfGivenDayInMonth = (
  /** The year */
  year: number,
  /** 0 is Monday, 6 is Sunday */
  weekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  /** 0 is January, 11 is December */
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11,
): Date => {
  const firstDayOfMonth = new Date(year, month, 1);

  const jsDay = firstDayOfMonth.getDay();

  const currentDay = jsDay === 0 ? 6 : jsDay - 1;

  const daysToAdd = (weekDay - currentDay + 7) % 7;

  return new Date(year, month, 1 + daysToAdd);
};
