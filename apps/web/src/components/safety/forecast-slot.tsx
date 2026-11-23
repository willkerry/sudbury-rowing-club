import { WeatherIcon } from "@sudburyrc/weathericons";
import { IconAlertTriangle, IconArrowNarrowUp } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toLondonHourLabel } from "@/lib/forecast/london-time";
import type { ForecastSlot } from "@/lib/forecast/to-forecast-days";
import { cn } from "@/lib/utils";

const GALE_FORCE = 6;
const COLD_CELSIUS = 4;
const HOT_CELSIUS = 30;
const FOGGY_PERCENT = 40;
const MS_PER_HOUR = 3_600_000;

type WarningType = "high wind" | "low temperature" | "high temperature" | "fog";

const listFormatter = new Intl.ListFormat("en-GB", {
  style: "long",
  type: "conjunction",
});

const WARNING_PHRASES: Record<WarningType, string> = {
  fog: "fog",
  "high temperature": `temperatures above ${HOT_CELSIUS}°C`,
  "high wind": `wind at force ${GALE_FORCE} or more`,
  "low temperature": `temperatures below ${COLD_CELSIUS}°C`,
};

export const describeWarnings = (warnings: WarningType[]): string =>
  `Expect ${listFormatter.format(warnings.map((warning) => WARNING_PHRASES[warning]))}.`;

// A typographic minus reads as a sign rather than a hyphen.
export const formatTemperature = (celsius: number): string =>
  celsius < 0 ? `−${Math.abs(celsius)}` : String(celsius);

export const getWarnings = ({
  fog,
  temperature,
  temperatureMin,
  temperatureMax,
  wind,
}: ForecastSlot): WarningType[] => {
  const warnings: WarningType[] = [];

  if (wind.beaufort >= GALE_FORCE) warnings.push("high wind");
  if ((temperatureMin ?? temperature) < COLD_CELSIUS)
    warnings.push("low temperature");
  if ((temperatureMax ?? temperature) > HOT_CELSIUS)
    warnings.push("high temperature");
  if (fog >= FOGGY_PERCENT) warnings.push("fog");

  return warnings;
};

export const ForecastSlotColumn = ({
  isNow = false,
  slot,
}: {
  isNow?: boolean;
  slot: ForecastSlot;
}) => {
  const warnings = getWarnings(slot);
  const hour = toLondonHourLabel(slot.time);
  const isBlock = slot.span === 6;
  const label = isBlock
    ? `${hour}–${toLondonHourLabel(new Date(slot.time.getTime() + slot.span * MS_PER_HOUR))}`
    : hour;
  const high = isBlock ? (slot.temperatureMax ?? slot.temperature) : undefined;
  const low = isBlock ? slot.temperatureMin : undefined;

  return (
    <div className="flex snap-start flex-col items-center gap-1 px-1 py-3 text-center select-none">
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-semibold tabular-nums",
          isNow ? "text-black" : "text-gray-400",
        )}
      >
        {label}

        {warnings.length > 0 && (
          <Popover>
            <PopoverTrigger className="-m-1.5 rounded-sm p-1.5 transition-transform duration-100 ease-out focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-hidden active:scale-90">
              <IconAlertTriangle
                aria-hidden
                className="size-3 text-amber-600"
              />
              <span className="sr-only">{`Weather warning at ${label}`}</span>
            </PopoverTrigger>
            <PopoverContent
              className="w-max max-w-64 px-3 py-2 font-normal text-gray-900"
              side="top"
            >
              {describeWarnings(warnings)}
            </PopoverContent>
          </Popover>
        )}
      </div>

      <WeatherIcon className="size-7" symbol={slot.symbol} />

      {high === undefined ? (
        <div className="disambiguate text-sm font-semibold text-gray-600 tabular-nums">
          {formatTemperature(slot.temperature)}
          <span className="text-gray-400">°</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-1.5 disambiguate text-sm font-semibold tabular-nums">
          <span className="sr-only">High</span>
          <span className="text-gray-600">
            {formatTemperature(high)}
            <span className="text-gray-400">°</span>
          </span>
          {low !== undefined && low !== high && (
            <>
              <span className="sr-only">, low</span>
              <span className="text-xs text-gray-400">
                {formatTemperature(low)}°
              </span>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-0.5 text-xs font-semibold tracking-widest text-gray-600">
        <IconArrowNarrowUp
          aria-label={`Force ${slot.wind.beaufort}, wind from ${slot.wind.direction}`}
          className="size-3.5 text-gray-400"
          role="img"
          style={{ transform: `rotate(${slot.wind.bearing - 180}deg)` }}
        />
        <span aria-hidden className="italic">
          <span className="font-black text-gray-400">F</span>
          {slot.wind.beaufort}
        </span>
      </div>
    </div>
  );
};
