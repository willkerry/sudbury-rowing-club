import getWeatherForecast, {
  briefWeatherCodes,
  getMetOfficeURL,
} from "@/lib/get-weather-forecast";
import cn from "clsx";
import { Loading } from "../stour/loading";
import DateFormatter from "../utils/date-formatter";

export const ForecastComponent = async () => {
  const forecast = await getWeatherForecast();

  const status: string = "";

  if (status === "error") return null;

  return (
    <div className="overflow-x-scroll bg-gray-100">
      <Loading visible={status === "pending"}>
        <div className="grid w-full min-w-[30rem] grid-cols-7 gap-1 p-3">
          {forecast?.map(({ beaufort, code, date, maxTemp, minTemp }) => (
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

              <div className="mb-0.5 font-semibold text-gray-500 text-xs group-hover:text-blue-400">
                {briefWeatherCodes[code]}
              </div>

              <div
                className={cn(
                  "disambiguate mb-0.5 whitespace-nowrap font-semibold text-xs transition",
                  maxTemp > 30 || minTemp < 4
                    ? "font-bold text-red-600 underline decoration-red-300 underline-offset-2"
                    : "text-gray-700 group-hover:text-blue-500",
                )}
              >
                {Intl.NumberFormat("en-GB", {
                  unit: "celsius",
                  style: "unit",
                }).formatRange(minTemp, maxTemp)}
              </div>

              <div
                className={cn(
                  "disambiguate text-xs transition",
                  beaufort >= 6
                    ? "font-bold text-red-600"
                    : "font-semibold text-gray-600 group-hover:text-blue-400",
                )}
              >
                <span className="font-medium">Force</span> {beaufort}
              </div>
            </a>
          ))}
        </div>
      </Loading>
    </div>
  );
};
