import cn from "classnames";
import PropTypes from "prop-types";
import { ExclamationIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import DateTimeFormatter from "../utils/datetime-formatter";
import EnvironmentAgency from "../icons/organisations/environment-agency";
import MetOffice from "../icons/organisations/met-office";
import Label from "../stour/label";

export default function SafetyPopup({ description, date, status }) {
  return (
    <div className="divide-y">
      <div className="p-4">
        <Label as="h2">River Safety Status</Label>
      </div>
      <SeveritySection status={status} />

      <div className="p-4">
        {description}
        {date && (
          <div className="mt-6 text-xs text-gray-600">
            Updated <DateTimeFormatter dateString={date} />
          </div>
        )}
      </div>
      <div className="grid grid-flow-col grid-cols-2 divide-x">
        <Link href="https://flood-warning-information.service.gov.uk/warnings?location=+Sudbury">
          <a className="flex items-center justify-between px-4 text-sm text-gray-500 transition duration-300 h-14 bg-gray-50 hover:text-black hover:bg-white group">
            <EnvironmentAgency className="w-4 h-4" />
            EA Floods
            <ArrowTopRightOnSquareIcon className="w-4 h-4 transition duration-300 opacity-30 group-hover:opacity-70" />
          </a>
        </Link>
        <Link href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings">
          <a className="flex items-center justify-between px-4 text-sm text-gray-500 transition duration-300 h-14 bg-gray-50 hover:text-black hover:bg-white group">
            <div className="w-0">
              <MetOffice className="w-4 h-4" />
            </div>
            Met Office
            <ArrowTopRightOnSquareIcon className="w-4 h-4 transition duration-300 opacity-30 group-hover:opacity-70" />
          </a>
        </Link>
      </div>
    </div>
  );
}

SafetyPopup.propTypes = {
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

function SeveritySection({ status }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between h-24 p-4 text-4xl font-bold tracking-tight capitalize",
        {
          "text-red-500 bg-red-50": status === "red",
          "text-yellow-500 bg-yellow-50": status === "amber",
          "text-green-500 bg-green-50": status === "green",
          "text-blue-500 bg-blue-50": status === "neutral",
        }
      )}
    >
      {status}
      {(status === "red" || status === "amber") && (
        <ExclamationIcon className="w-6 h-6" />
      )}
    </div>
  );
}

SeveritySection.propTypes = {
  status: PropTypes.string.isRequired,
};
