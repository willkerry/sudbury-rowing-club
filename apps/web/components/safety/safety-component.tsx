import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { Severity } from "@/types/severity";
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

const SafetyComponent = ({
  description,
  date,
  status,
  statusMessage,
  source,
}: SafetyComponentProps) => (
  <div className="divide-y">
    <div className="p-3 sm:p-4">
      <Label as="h2">River Safety Status</Label>
    </div>

    <SeveritySection status={status} message={statusMessage} />

    <div className="p-3 sm:p-4">
      {source ? <QuotedWarning {...{ description, source }} /> : description}
      {date && (
        <div className="disambiguate mt-4 text-sm font-medium text-gray-500">
          Updated <DateFormatter dateString={date} format="time" />
        </div>
      )}
    </div>

    <ForecastComponent />

    <div className="grid grid-flow-col grid-cols-2 divide-x">
      <a
        href="https://flood-warning-information.service.gov.uk/warnings?location=+Sudbury"
        className="group flex h-14 items-center justify-between bg-gray-50 px-4 text-sm text-gray-500 transition duration-300 hover:bg-white hover:text-black"
      >
        <EnvironmentAgency className="h-4 w-4" />
        EA Floods
        <ArrowTopRightOnSquareIcon className="h-4 w-4 opacity-30 transition duration-300 group-hover:opacity-70" />
      </a>
      <a
        href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings"
        className="group flex h-14 items-center justify-between bg-gray-50 px-4 text-sm text-gray-500 transition duration-300 hover:bg-white hover:text-black"
      >
        <div className="w-0">
          <MetOffice className="h-4 w-4" />
        </div>
        Met Office
        <ArrowTopRightOnSquareIcon className="h-4 w-4 opacity-30 transition duration-300 group-hover:opacity-70" />
      </a>
    </div>
  </div>
);

export default SafetyComponent;
