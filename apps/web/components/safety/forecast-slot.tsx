import { WeatherIcon } from "@sudburyrc/weathericons";
import { TriangleAlertIcon } from "lucide-react";
import type { ForecastSlot } from "@/lib/forecast/to-forecast-days";
import { cn } from "@/lib/utils";

const GALE_FORCE = 6;
const COLD_CELSIUS = 4;
const HOT_CELSIUS = 30;
const FOGGY_PERCENT = 40;

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

const hourFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/London",
});

export const ForecastSlotColumn = ({ slot }: { slot: ForecastSlot }) => (
  <div
    className={cn(
      "flex shrink-0 flex-col items-center gap-1 px-1 text-center",
      slot.span === 6 ? "w-24" : "w-12",
    )}
    data-span={slot.span}
  >
    <div className="font-semibold text-gray-500 text-xs tabular-nums">
      {hourFormatter.format(slot.time)}
    </div>

    <WeatherIcon className="size-7" symbol={slot.symbol} />

    <div className="disambiguate font-semibold text-gray-700 text-xs tabular-nums">
      {slot.temperature}°
    </div>

    <div className="h-4 font-medium text-blue-600 text-xs tabular-nums">
      {slot.precipitation > 0 ? `${slot.precipitation}mm` : ""}
    </div>

    <div className="flex items-center gap-0.5 font-semibold text-gray-600 text-xs">
      <span className="tabular-nums">{slot.wind.beaufort}</span>
      <span className="font-medium text-gray-400">{slot.wind.direction}</span>
    </div>

    <div className="h-3">
      {hasWarning(slot) && (
        <TriangleAlertIcon aria-hidden className="size-3 text-red-600" />
      )}
    </div>
  </div>
);
