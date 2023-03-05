import getWeatherForecast, {
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
  const { data: forecast } = useSWR("getWeatherForecast", () =>
    getWeatherForecast()
  );

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
                title={weatherCodes[f.code]}
                className="group-hover:text-blue-500 text-gray-600 transition"
              >
                {weatherIcons[f.code]}
              </div>

              <div
                className={cn(
                  "flex items-center justify-center h-full text-xs font-semibold disambiguate transition leading-none",
                  f.maxTemp > 30 || f.maxTemp < 4
                    ? "text-red-600 group-hover:bg-white rounded-sm p-1 -m-1 underline font-bold underline-offset-2 decoration-red-300 "
                    : "text-gray-700 group-hover:text-blue-500"
                )}
              >
                {f.maxTemp}℃
              </div>

              <div
                className={cn(
                  "flex items-center transition",
                  f.beaufort >= 6
                    ? "text-red-600 group-hover:bg-white rounded pl-1 -ml-1"
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
