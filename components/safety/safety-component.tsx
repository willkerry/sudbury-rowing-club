import getWeatherForecast, {
  Forecast,
  weatherCodes,
} from "@/lib/get-weather-forecast";
import { Severity } from "@/types/severity";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { ArrowLongUpIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { EnvironmentAgency, MetOffice } from "../icons";
import { weatherIcons, windIcons } from "../icons/weather-icons";
import Label from "../stour/label";
import Loading from "../stour/loading";
import DateFormatter from "../utils/date-formatter";
import QuotedWarning, { WarningSourceEnum } from "./quoted-warning";
import SeveritySection from "./severity-section";

export type SafetyComponentProps = {
  description: string;
  date?: Date;
  status: Severity;
  statusMessage: string;
  source?: WarningSourceEnum;
};

const SafetyComponent: React.FC<SafetyComponentProps> = ({
  description,
  date,
  status,
  statusMessage,
  source,
}) => {
  const [forecast, setForecast] = useState<Forecast[]>([]);

  useEffect(() => {
    if (forecast.length === 0) {
      getWeatherForecast().then((r) => setForecast(r));
    }
  }, [forecast.length]);

  return (
    <div className="divide-y">
      <div className="p-3 sm:p-4">
        <Label as="h2">River Safety Status</Label>
      </div>

      <SeveritySection status={status} message={statusMessage} />

      <div className="p-3 sm:p-4">
        {source ? <QuotedWarning {...{ description, source }} /> : description}
        {date && (
          <div className="mt-6 text-xs text-gray-600">
            Updated <DateFormatter dateString={date} format="time" />
          </div>
        )}
      </div>
      <div className="w-full p-3 bg-green-50 sm:px-4">
        <Loading visible={forecast.length === 0}>
          <div className="grid w-full grid-cols-7 pb-2">
            {forecast.map((f, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-xs font-medium tracking-widest text-green-600 uppercase">
                  <DateFormatter dateString={f.date} format="shortWeekday" />
                </div>
                <div
                  className="flex items-center justify-center h-full text-xs text-green-700"
                  title={weatherCodes[f.code]}
                >
                  {weatherIcons[f.code]}
                </div>
                <div className="text-xs font-semibold text-green-600 uppercase">
                  {f.maxTemp}℃
                </div>
                <div className="flex flex-col items-center gap-px mt-2 mb-1 text-green-400 border-2 border-green-200 rounded-full">
                  <ArrowLongUpIcon
                    className="w-6 h-6 m-px"
                    style={{
                      transform: `rotate(${f.windDirection}deg)`,
                    }}
                  />
                </div>
                <div className="flex items-center text-xs italic font-bold text-green-400">
                  <span className="invisible sm:visible">FORCE</span>
                  <span className="visible sm:invisible">B</span>
                  {f.beaufort}
                </div>
              </div>
            ))}
          </div>
        </Loading>
      </div>
      <div className="grid grid-flow-col grid-cols-2 divide-x">
        <a
          href="https://flood-warning-information.service.gov.uk/warnings?location=+Sudbury"
          className="flex items-center justify-between px-4 text-sm text-gray-500 transition duration-300 h-14 bg-gray-50 hover:text-black hover:bg-white group"
        >
          <EnvironmentAgency className="w-4 h-4" />
          EA Floods
          <ArrowTopRightOnSquareIcon className="w-4 h-4 transition duration-300 opacity-30 group-hover:opacity-70" />
        </a>
        <a
          href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings"
          className="flex items-center justify-between px-4 text-sm text-gray-500 transition duration-300 h-14 bg-gray-50 hover:text-black hover:bg-white group"
        >
          <div className="w-0">
            <MetOffice className="w-4 h-4" />
          </div>
          Met Office
          <ArrowTopRightOnSquareIcon className="w-4 h-4 transition duration-300 opacity-30 group-hover:opacity-70" />
        </a>
      </div>
    </div>
  );
};

export default SafetyComponent;
