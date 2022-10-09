import { Severity } from "@/types/severity";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { EnvironmentAgency, MetOffice } from "../icons";
import Label from "../stour/label";
import DateFormatter from "../utils/date-formatter";
import ForecastComponent from "./forecast";
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

      <ForecastComponent />

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
