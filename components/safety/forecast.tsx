import getWeatherForecast, {
  getYRURL,
  weatherCodes,
} from "@/lib/get-weather-forecast";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import cn from "@/lib/cn";
import { weatherIcons, windIcons } from "../icons/weather-icons";
import Loading from "../stour/loading";
import DateFormatter from "../utils/date-formatter";

const ForecastComponent = () => {
  const fetcher: typeof getWeatherForecast = () =>
    fetch("/api/weather").then((res) => res.json());

  const { data: forecast } = useSWR("getWeatherForecast", fetcher);

  return (
    <div className="w-full bg-gray-100 p-3 sm:px-4">
      <Loading visible={forecast?.length === 0}>
        <div className="grid w-full grid-cols-7">
          {forecast?.map((f) => (
            <a
              key={String(f.date)}
              className="group relative flex flex-col items-center gap-1"
              href={getYRURL(f.date)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 transition group-hover:text-blue-500">
                <DateFormatter dateString={f.date} format="shortWeekday" />
              </div>

              <div
                title={weatherCodes[f.code]}
                className="text-gray-600 transition group-hover:text-blue-500"
              >
                {weatherIcons[f.code]}
              </div>

              <div
                className={cn(
                  "disambiguate flex h-full items-center justify-center text-xs font-semibold leading-none transition",
                  f.maxTemp > 30 || f.maxTemp < 4
                    ? "-m-1 rounded-sm p-1 font-bold text-red-600 underline decoration-red-300 underline-offset-2 group-hover:bg-white "
                    : "text-gray-700 group-hover:text-blue-500"
                )}
              >
                {f.maxTemp}℃
              </div>

              <div
                className={cn(
                  "flex items-center transition",
                  f.beaufort >= 6
                    ? "-ml-1 rounded pl-1 text-red-600 group-hover:bg-white"
                    : "text-gray-400 group-hover:text-blue-400"
                )}
                title={`Force ${f.beaufort}, ${f.windDirectionText}`}
              >
                <div className="flex flex-col items-center rounded-full bg-current">
                  <ArrowDownIcon
                    className="m-px h-2.5 w-2.5 stroke-[3px] text-gray-100"
                    style={{
                      transform: `rotate(${f.windDirection}deg)`,
                    }}
                  />
                </div>
                <div className="-my-1.5 pt-1 text-sm font-semibold">
                  {windIcons[f.beaufort]}
                </div>
              </div>
            </a>
          ))}
        </div>
      </Loading>
    </div>
  );
};

export default ForecastComponent;
