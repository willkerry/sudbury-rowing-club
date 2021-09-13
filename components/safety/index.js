import safety from "@/data/safety.json";
import DateTimeFormatter from "../datetime-formatter";
import cn from "classnames";
import Button from "../stour/button";
import EnvironmentAgency from "../icons/organisations/environment-agency";
import MetOffice from "../icons/organisations/met-office";

const status = safety.status;

export default function SafetyPopup() {
  return (
    <div className="divide-y">
      <h2 className="flex items-center p-4 text-sm font-medium tracking-widest text-gray-600 uppercase">
        <Dot /> River Safety Status
      </h2>

      <div className="p-4">
        <span className="font-semibold">{status.severity}: </span>
        {status.description}
        {status.date && (
          <div className="mt-4 text-xs">
            Updated <DateTimeFormatter dateString={status.date} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 p-4">
        <Button
          href="https://flood-warning-information.service.gov.uk/warnings?location=+Sudbury"
          variant="primary"
          iconLeft={<EnvironmentAgency />}
        >
          EA Floods
        </Button>
        <Button
          href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings"
          iconLeft={<MetOffice />}
          variant="primary"
        >
          Met&nbsp;Office
        </Button>
      </div>
    </div>
  );
}

function Dot() {
  return (
    <div
      className={cn("w-4 h-4 mr-2 rounded-full", {
        "bg-red-600": status.severity == "Red",
        "bg-yellow-500": status.severity == "Amber",
        "bg-green-600": status.severity == "Green",
        "bg-blue-500": status.severity == "Neutral",
      })}
    />
  );
}
