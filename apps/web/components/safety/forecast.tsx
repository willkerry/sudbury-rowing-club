import getWeatherForecast, {
  briefWeatherCodes,
  getYRURL,
} from "@/lib/get-weather-forecast";
import useSWR from "swr";
import cn from "clsx";
import Loading from "../stour/loading";
import DateFormatter from "../utils/date-formatter";

const ForecastComponent = () => {
  const fetcher: typeof getWeatherForecast = () =>
    fetch("/api/weather").then((res) => res.json());

  const { data: forecast, isLoading } = useSWR("getWeatherForecast", fetcher);

  return (
    <div className="w-full bg-gray-100 p-3 sm:px-4">
      <Loading visible={isLoading}>
        <div className="grid w-full grid-cols-7 gap-1">
          {forecast?.map(({ beaufort, code, date, maxTemp, minTemp }) => (
            <a
              key={String(date)}
              className="group mb-2 text-center"
              href={getYRURL(date)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <DateFormatter dateString={date} format="shortWeekday" />
              </h3>

              <div className="mb-0.5 text-xs font-semibold text-gray-500 group-hover:text-blue-400">
                {briefWeatherCodes[code]}
              </div>

              <div
                className={cn(
                  "disambiguate mb-0.5 text-xs font-semibold transition",
                  maxTemp > 30 || minTemp < 4
                    ? "font-bold text-red-600 underline decoration-red-300 underline-offset-2"
                    : "text-gray-700 group-hover:text-blue-500"
                )}
              >
                {minTemp}&thinsp;-&thinsp;{maxTemp}℃
              </div>

              <div
                className={cn(
                  "disambiguate text-xs transition",
                  beaufort >= 6
                    ? "font-bold text-red-600"
                    : "font-semibold text-gray-600 group-hover:text-blue-400"
                )}
              >
                <span className="font-medium">Force</span> {beaufort}{" "}
              </div>
            </a>
          ))}
        </div>
      </Loading>
    </div>
  );
};

export default ForecastComponent;
