import safety from "@/data/safety.json";
import DateTimeFormatter from "../datetime-formatter";
import cn from "classnames";
import Button from "../stour/button";
import EnvironmentAgency from "../icons/organisations/environment-agency";
import MetOffice from "../icons/organisations/met-office";
import { ExclamationIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import Link from "next/link";
import Label from "../stour/label";

const status = safety.status;

export default function SafetyPopup() {
  return (
    <div className="divide-y">
      <div className="p-4">
        <Label as="h2">River Safety Status</Label>
      </div>
      <SeveritySection />

      <div className="p-4">
        {status.description}
        {status.date && (
          <div className="mt-6 text-xs text-gray-600">
            Updated <DateTimeFormatter dateString={status.date} />
          </div>
        )}
      </div>
      <div className="grid grid-flow-col grid-cols-2 divide-x">
        <Link href="https://flood-warning-information.service.gov.uk/warnings?location=+Sudbury">
          <a className="flex items-center justify-between px-4 text-sm text-gray-500 transition duration-300 h-14 bg-gray-50 hover:text-black hover:bg-white group">
            <EnvironmentAgency className="w-4 h-4" />
            EA Floods
            <ExternalLinkIcon className="w-4 h-4 transition duration-300 opacity-30 group-hover:opacity-70" />
          </a>
        </Link>
        <Link href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings">
          <a className="flex items-center justify-between px-4 text-sm text-gray-500 transition duration-300 h-14 bg-gray-50 hover:text-black hover:bg-white group">
            <div className="w-0">
              <MetOffice className="w-4 h-4" />
            </div>
            Met Office
            <ExternalLinkIcon className="w-4 h-4 transition duration-300 opacity-30 group-hover:opacity-70" />
          </a>
        </Link>
      </div>
    </div>
  );
}

function SeveritySection() {
  return (
    <div
      className={cn(
        "flex items-center justify-between h-24 p-4 text-4xl font-bold tracking-tight",
        {
          "text-red-500 bg-red-50": status.severity == "Red",
          "text-yellow-500 bg-yellow-50": status.severity == "Amber",
          "text-green-500 bg-green-50": status.severity == "Green",
          "text-blue-500 bg-blue-50": status.severity == "Neutral",
        }
      )}
    >
      {status.severity}
      {(status.severity == "Red" || status.severity == "Amber") && (
        <ExclamationIcon className="w-6 h-6" />
      )}
    </div>
  );
}
