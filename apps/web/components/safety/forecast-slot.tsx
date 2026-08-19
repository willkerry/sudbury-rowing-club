import { WeatherIcon } from "@sudburyrc/weathericons";
import { ArrowUpCircleIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import type { ForecastSlot } from "@/lib/forecast/to-forecast-days";
import { cn } from "@/lib/utils";

const GALE_FORCE = 6;
const COLD_CELSIUS = 4;
const HOT_CELSIUS = 30;
const FOGGY_PERCENT = 40;

type WarningType = "high wind" | "low temperature" | "high temperature" | "fog";

const listFormatter = new Intl.ListFormat("en-GB", {
  style: "long",
  type: "conjunction",
});

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

const hourFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/London",
});

export const ForecastSlotColumn = ({
  isNow = false,
  slot,
}: {
  isNow?: boolean;
  slot: ForecastSlot;
}) => {
  const warnings = getWarnings(slot);
  const warningDescription =
    warnings.length > 0
      ? `Warning due to ${listFormatter.format(warnings)}.`
      : null;

  return (
    <div
      className={cn(
        "flex select-none snap-start flex-col items-center gap-1 px-1 py-3 text-center",
        isNow && "bg-white/5",
      )}
      data-hour={hourFormatter.format(slot.time)}
    >
      <div
        className={cn(
          "flex items-center gap-1 font-semibold text-xs tabular-nums",
          isNow ? "text-white" : "text-white/45",
        )}
      >
        {hourFormatter.format(slot.time)}

        {warnings.length > 0 && (
          <button
            onClick={() =>
              toast.info(`Warning due to ${listFormatter.format(warnings)}.`)
            }
            type="button"
          >
            <TriangleAlertIcon aria-hidden className="size-3 text-red-400" />
          </button>
        )}
      </div>

      <WeatherIcon className="size-7" symbol={slot.symbol} />

      <div className="disambiguate font-semibold text-sm text-white tabular-nums">
        {slot.temperature}
        <span className="text-white/60">°</span>
      </div>

      <button
        className="flex items-center gap-0.5 font-semibold text-white/80 text-xs"
        onClick={() => toast.info(warningDescription)}
        type="button"
      >
        <span className="tabular-nums">{slot.wind.beaufort}</span>
        <ArrowUpCircleIcon
          aria-label={slot.wind.direction}
          className="size-4 text-white opacity-50"
          style={{ transform: `rotate(${slot.wind.bearing - 180}deg)` }}
        />
      </button>
    </div>
  );
};
