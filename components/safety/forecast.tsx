import getWeatherForecast, {
  Forecast,
  getYRURL,
  weatherCodes,
} from "@/lib/get-weather-forecast";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import useSWR from "swr";
import { weatherIcons, windIcons } from "../icons/weather-icons";
import Loading from "../stour/loading";
import DateFormatter from "../utils/date-formatter";
import cn from "classnames";

const ForecastComponent = () => {
  const fetcher = () => getWeatherForecast();

  const { data: forecast } = useSWR<Forecast[]>("getWeatherForecast", fetcher, {
    suspense: true,
    refreshInterval: 0,
    dedupingInterval: 20000,
  });

  return (
    <div className="w-full p-3 bg-gray-100 sm:px-4">
      <Loading visible={forecast?.length === 0}>
        <div className="grid w-full grid-cols-7">
          {forecast?.map((f, i) => (
            <a
              key={i}
              className="relative flex flex-col items-center gap-1 group"
              href={getYRURL(f.date)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="text-xs font-semibold tracking-widest text-gray-500 uppercase transition group-hover:text-blue-500">
                <DateFormatter dateString={f.date} format="shortWeekday" />
              </div>

              <div
                className="grid items-center justify-center h-full text-xs text-gray-700"
                title={weatherCodes[f.code]}
              >
                <div className="col-start-1 row-start-1 transition duration-300 opacity-100 group-hover:opacity-0">
                  {weatherIcons[f.code]}
                </div>
                <ArrowTopRightOnSquareIcon className="w-4 h-4 col-start-1 row-start-1 mx-auto text-blue-400 transition duration-300 opacity-0 group-hover:opacity-100" />
              </div>

              <div
                className={cn(
                  "flex items-center justify-center h-full text-xs font-semibold disambiguate transition leading-none",
                  f.maxTemp > 30
                    ? "text-red-600 group-hover:text-red-700"
                    : f.maxTemp < 5
                    ? "text-blue-500 group-hover:text-blue-600"
                    : "text-gray-700 group-hover:text-blue-500"
                )}
              >
                {f.maxTemp}℃
              </div>

              <div
                className={cn(
                  "flex items-center transition",
                  f.beaufort >= 8
                    ? "text-red-500 group-hover:text-red-400"
                    : f.beaufort >= 7
                    ? "text-amber-500 group-hover:text-amber-400"
                    : "text-gray-400 group-hover:text-blue-400"
                )}
                title={`Force ${f.beaufort}, ${f.windDirectionText}`}
              >
                <div className="flex flex-col items-center bg-current rounded-full">
                  <ArrowDownIcon
                    className="w-2.5 h-2.5 m-px stroke-[3px] text-gray-100"
                    style={{
                      transform: `rotate(${f.windDirection}deg)`,
                    }}
                  />
                </div>
                <div className="pt-1 -my-1.5 text-sm font-semibold">
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
