import { WeatherIcon } from "@sudburyrc/weathericons";
import { ArrowUpCircleIcon, TriangleAlertIcon } from "lucide-react";
import type { SkyInk } from "@/lib/forecast/sky-theme";
import type { ForecastSlot } from "@/lib/forecast/to-forecast-days";
import { cn } from "@/lib/utils";

const GALE_FORCE = 6;
const COLD_CELSIUS = 4;
const HOT_CELSIUS = 30;
const FOGGY_PERCENT = 40;

const RAIN_FULL_SCALE_MM = 4;
const RAIN_MIN_VISIBLE_PERCENT = 15;

const HALF_TURN = 180;

export const hasWarning = ({
  fog,
  temperature,
  temperatureMin,
  temperatureMax,
  wind,
}: ForecastSlot): boolean =>
  wind.beaufort >= GALE_FORCE ||
  (temperatureMin ?? temperature) < COLD_CELSIUS ||
  (temperatureMax ?? temperature) > HOT_CELSIUS ||
  fog >= FOGGY_PERCENT;

/**
 * The bar saturates at 4mm in an hour so ordinary drizzle stays legible
 * instead of collapsing to a sliver beside one downpour.
 */
export const rainBarPercent = (millimetres: number): number => {
  if (millimetres <= 0) return 0;

  return Math.max(
    RAIN_MIN_VISIBLE_PERCENT,
    Math.min(millimetres / RAIN_FULL_SCALE_MM, 1) * 100,
  );
};

const hourFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/London",
});

export const ForecastSlotColumn = ({
  ink,
  isNow = false,
  slot,
}: {
  ink: SkyInk;
  isNow?: boolean;
  slot: ForecastSlot;
}) => {
  const rainHeight = rainBarPercent(slot.precipitation);

  return (
    <div
      className={cn(
        "flex w-20 shrink-0 snap-start flex-col items-center gap-1 px-1 py-3 text-center",
        isNow && ink.nowBackdrop,
      )}
      data-hour={hourFormatter.format(slot.time)}
    >
      <div
        className={cn(
          "flex items-center gap-1 font-semibold text-xs tabular-nums",
          isNow ? ink.hourNow : ink.hourMuted,
        )}
      >
        {hourFormatter.format(slot.time)}

        {hasWarning(slot) && (
          <TriangleAlertIcon
            aria-hidden
            className={cn("size-3", ink.warning)}
          />
        )}
      </div>

      <WeatherIcon className="size-7" symbol={slot.symbol} />

      <div
        className={cn(
          "disambiguate font-semibold text-sm tabular-nums",
          ink.temperature,
        )}
      >
        {slot.temperature}°
      </div>

      <div
        aria-hidden
        className={cn(
          "flex h-4 w-3 items-end justify-center rounded-xs",
          ink.rainTrack,
        )}
      >
        {rainHeight > 0 && (
          <div
            className={cn("w-full rounded-xs", ink.rainBar)}
            style={{ height: `${rainHeight}%` }}
          />
        )}
      </div>

      <div className="sr-only">
        {slot.precipitation > 0
          ? `${slot.precipitation}mm of rain`
          : "No rain expected"}
      </div>

      <div
        className={cn(
          "flex items-center gap-0.5 font-semibold text-xs",
          ink.wind,
        )}
      >
        <span className="tabular-nums">{slot.wind.beaufort}</span>
        <ArrowUpCircleIcon
          aria-label={slot.wind.direction}
          className={cn("size-4", ink.windArrow)}
          style={{ transform: `rotate(${slot.wind.bearing - HALF_TURN}deg)` }}
        />
      </div>
    </div>
  );
};
