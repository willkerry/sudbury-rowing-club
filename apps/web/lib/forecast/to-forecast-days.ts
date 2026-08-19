import type { LocationForecast } from "@sudburyrc/api";
import type { SymbolCode } from "@sudburyrc/weathericons";
import {
  type CardinalDirection,
  convertBearingToCardinal,
} from "@/lib/helpers/convertBearingToCardinal";
import { convertKphToBeaufort } from "@/lib/helpers/convertKphToBeaufort";

const MS_TO_KPH = 3.6;
const TIME_ZONE = "Europe/London";

const londonDayFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: TIME_ZONE,
  year: "numeric",
});

export const toLondonDate = (date: Date): string =>
  londonDayFormatter.format(date);

export type ForecastSlot = {
  time: Date;
  span: 1 | 6;
  symbol: SymbolCode;
  temperature: number;
  precipitation: number;
  wind: { beaufort: number; direction: CardinalDirection };
  fog: number;
};

export type ForecastDay = {
  date: string;
  slots: ForecastSlot[];
};

export const toForecastDays = (forecast: LocationForecast): ForecastDay[] => {
  const slotsByDate = new Map<string, ForecastSlot[]>();

  for (const entry of forecast.properties.timeseries) {
    const hourly = entry.data.next_1_hours;
    const period = hourly ?? entry.data.next_6_hours;
    const symbol = period?.summary?.symbol_code;

    if (!(period && symbol)) continue;

    const { details } = entry.data.instant;

    const slot: ForecastSlot = {
      fog: details.fog_area_fraction ?? 0,
      precipitation: period.details?.precipitation_amount ?? 0,
      span: hourly ? 1 : 6,
      symbol: symbol as SymbolCode,
      temperature: Math.round(details.air_temperature),
      time: entry.time,
      wind: {
        beaufort: convertKphToBeaufort(details.wind_speed * MS_TO_KPH),
        direction: convertBearingToCardinal(details.wind_from_direction),
      },
    };

    const date = toLondonDate(entry.time);
    const existing = slotsByDate.get(date);

    if (existing) existing.push(slot);
    else slotsByDate.set(date, [slot]);
  }

  return [...slotsByDate.entries()]
    .map(([date, slots]) => ({
      date,
      slots: slots.sort((a, b) => a.time.getTime() - b.time.getTime()),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
