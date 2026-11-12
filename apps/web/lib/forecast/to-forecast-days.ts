import type { LocationForecast } from "@sudburyrc/api";
import type { SymbolCode } from "@sudburyrc/weathericons";
import {
  type CardinalDirection,
  convertBearingToCardinal,
} from "@/lib/helpers/convertBearingToCardinal";
import { convertKphToBeaufort } from "@/lib/helpers/convertKphToBeaufort";
import { toLondonDate } from "./london-time";

const MS_TO_KPH = 3.6;

export type ForecastSlot = {
  time: Date;
  span: 1 | 6;
  symbol: SymbolCode;
  temperature: number;
  temperatureMin?: number;
  temperatureMax?: number;
  wind: { beaufort: number; direction: CardinalDirection; bearing: number };
  fog: number;
};

export type ForecastDay = {
  date: string;
  slots: ForecastSlot[];
};

type Period = NonNullable<
  LocationForecast["properties"]["timeseries"][number]["data"]["next_1_hours"]
>;
type Entry = LocationForecast["properties"]["timeseries"][number];

const SIX_HOURS_MS = 6 * 3_600_000;

const toSlot = (
  entry: Entry,
  period: Period | undefined,
  span: ForecastSlot["span"],
): ForecastSlot | undefined => {
  const symbol = period?.summary?.symbol_code;

  if (!(period && symbol)) return;

  const { details } = entry.data.instant;
  const tMin = period.details?.air_temperature_min;
  const tMax = period.details?.air_temperature_max;

  return {
    fog: details.fog_area_fraction ?? 0,
    span,
    symbol: symbol as SymbolCode,
    temperature: Math.round(details.air_temperature),
    ...(tMin !== undefined && { temperatureMin: Math.round(tMin) }),
    ...(tMax !== undefined && { temperatureMax: Math.round(tMax) }),
    time: entry.time,
    wind: {
      bearing: details.wind_from_direction,
      beaufort: convertKphToBeaufort(details.wind_speed * MS_TO_KPH),
      direction: convertBearingToCardinal(details.wind_from_direction),
    },
  };
};

/**
 * A day where MET's hourly series runs out is rebuilt as six-hour blocks
 * aligned to the first six-hourly entry, using the next_6_hours that hourly
 * entries also carry, so no day mixes hour columns with block columns.
 */
const toDaySlots = (entries: Entry[]): ForecastSlot[] => {
  const firstBlock = entries.find((entry) => !entry.data.next_1_hours);

  if (!firstBlock) {
    return entries.flatMap(
      (entry) => toSlot(entry, entry.data.next_1_hours, 1) ?? [],
    );
  }

  const anchor = firstBlock.time.getTime();

  return entries.flatMap((entry) =>
    (entry.time.getTime() - anchor) % SIX_HOURS_MS === 0
      ? (toSlot(entry, entry.data.next_6_hours, 6) ?? [])
      : [],
  );
};

export const toForecastDays = (forecast: LocationForecast): ForecastDay[] => {
  const entriesByDate = new Map<string, Entry[]>();

  for (const entry of forecast.properties.timeseries) {
    const date = toLondonDate(entry.time);
    const existing = entriesByDate.get(date);

    if (existing) existing.push(entry);
    else entriesByDate.set(date, [entry]);
  }

  return [...entriesByDate.entries()]
    .map(([date, entries]) => ({
      date,
      slots: toDaySlots(
        entries.sort((a, b) => a.time.getTime() - b.time.getTime()),
      ),
    }))
    .filter((day) => day.slots.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
};
