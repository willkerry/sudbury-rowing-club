const TIME_ZONE = "Europe/London";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: TIME_ZONE,
  year: "numeric",
});

const hourFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hourCycle: "h23",
  timeZone: TIME_ZONE,
});

export const toLondonDate = (date: Date): string => dayFormatter.format(date);

export const toLondonHourLabel = (date: Date): string =>
  hourFormatter.format(date);

export const toLondonHour = (date: Date): number =>
  Number(hourFormatter.format(date));
