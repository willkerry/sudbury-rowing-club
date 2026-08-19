import { WeatherIcon } from "@sudburyrc/weathericons";
import { ArrowUpCircleIcon, TriangleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { toLondonHourLabel } from "@/lib/forecast/london-time";
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

export const ForecastSlotColumn = ({
  isNow = false,
  slot,
}: {
  isNow?: boolean;
  slot: ForecastSlot;
}) => {
  const warnings = getWarnings(slot);
  const hour = toLondonHourLabel(slot.time);

  return (
    <div className="flex select-none snap-start flex-col items-center gap-1 px-1 py-3 text-center">
      <div
        className={cn(
          "flex items-center gap-1 font-semibold text-xs tabular-nums",
          isNow ? "text-black" : "text-gray-400",
        )}
      >
        {hour}

        {warnings.length > 0 && (
          <button
            onClick={() =>
              toast.info(`Warning due to ${listFormatter.format(warnings)}.`)
            }
            type="button"
          >
            <TriangleAlertIcon aria-hidden className="size-3 text-amber-600" />
            <span className="sr-only">{`Weather warning at ${hour}`}</span>
          </button>
        )}
      </div>

      <WeatherIcon className="size-7" symbol={slot.symbol} />

      <div className="disambiguate font-semibold text-gray-600 text-sm tabular-nums">
        {slot.temperature}
        <span className="text-gray-400">°</span>
      </div>

      <div className="flex items-center gap-0.5 font-semibold text-gray-600 text-xs">
        <span className="tabular-nums">{slot.wind.beaufort}</span>
        <ArrowUpCircleIcon
          aria-label={`Wind from ${slot.wind.direction}`}
          className="size-4 text-gray-400"
          style={{ transform: `rotate(${slot.wind.bearing - 180}deg)` }}
        />
      </div>
    </div>
  );
};
