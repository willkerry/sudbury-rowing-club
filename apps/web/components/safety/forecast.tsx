import { TriangleAlertIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { Loading } from "@/components/stour/loading";
import { DateFormatter } from "@/components/utils/date-formatter";
import {
  getMetOfficeURL,
  getWeatherForecast,
} from "@/lib/get-weather-forecast";
import { cn } from "@/lib/utils";

const getExtremeTemperature = (
  maxTemp: number,
  minTemp: number,
): 0 | -1 | 1 => {
  if (maxTemp > 30) return 1;
  if (minTemp < 4) return -1;
  return 0;
};

const ExtremeConditionIcon = ({
  className,
  ...props
}: ComponentProps<typeof TriangleAlertIcon>) => (
  <TriangleAlertIcon
    aria-hidden
    className={cn("size-3 text-red-600", className)}
    {...props}
  />
);

const rangeFormatter = Intl.NumberFormat("en-GB", {
  unit: "celsius",
  style: "unit",
  signDisplay: "negative",
});

const TemperatureRange = ({
  maxTemp,
  minTemp,
}: {
  maxTemp: number;
  minTemp: number;
}) => {
  const extreme = getExtremeTemperature(maxTemp, minTemp);

  return (
    <div className="disambiguate mb-0.5 flex items-center justify-center gap-0.5 whitespace-nowrap font-semibold text-gray-700 text-xs transition group-hover:text-blue-500">
      {rangeFormatter.formatRange(minTemp, maxTemp)}
      {extreme !== 0 && <ExtremeConditionIcon />}
    </div>
  );
};

export const ForecastComponent = async () => {
  const forecast = await getWeatherForecast();

  const status: string = "";

  if (status === "error") return null;

  return (
    <div className="overflow-x-scroll bg-gray-100 md:overflow-x-hidden">
      <Loading visible={status === "pending"}>
        <div className="grid w-full min-w-[30rem] grid-cols-7 gap-1 p-3">
          {forecast?.map(({ code, condition, date, temp, wind }) => (
            <a
              key={String(date)}
              className="group mb-2 text-center"
              href={getMetOfficeURL(date)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="mb-1 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                <DateFormatter dateString={date} format="shortWeekday" />
              </h3>

              <div className="mb-0.5 flex items-center justify-center gap-0.5 text-gray-500 group-hover:text-blue-400">
                <div className="font-semibold text-xs">{condition.brief}</div>

                {code >= 95 && <ExtremeConditionIcon />}
              </div>

              <TemperatureRange maxTemp={temp.max} minTemp={temp.min} />

              <div className="disambiguate flex items-center justify-center gap-0.5 font-semibold text-gray-600 text-xs transition group-hover:text-blue-400">
                <span>
                  <span className="font-medium">Force</span> {wind.speed}
                </span>
                {wind.speed >= 6 && <ExtremeConditionIcon />}
              </div>
            </a>
          ))}
        </div>
      </Loading>
    </div>
  );
};
