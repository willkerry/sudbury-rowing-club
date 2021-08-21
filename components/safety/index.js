import safety from "@/data/safety.json";
import DateTimeFormatter from "../datetime-formatter";
import cn from "classnames";
import Button from "../stour/button";

export default function SafetyPopup() {
  return (
    <div className="flex p-6">
      <div className="hidden sm:flex">
        <div
          className={cn("w-12 h-12 mr-5 mt-4 border rounded-full", {
            "bg-red-600": safety.status.severity == "Red",
            "bg-yellow-500": safety.status.severity == "Amber",
            "bg-green-600": safety.status.severity == "Green",
            "bg-sudbury": safety.status.severity == "Neutral",
          })}
        />
      </div>
      <div>
        <h2 className="text-xs font-medium tracking-widest text-gray-500 uppercase">
          River Safety Status
        </h2>
        <h3 className="mb-6 mt-1.5 text-3xl font-bold text-gray-900">
          {safety.status.severity}
        </h3>
        <div className="leading-snug prose">
          <div>{safety.status.description}</div>
        </div>
        <div className="flex flex-col pt-4 space-y-2 text-sm lg:flex-row lg:space-y-0 lg:space-x-2">
          <Button
            href="https://flood-warning-information.service.gov.uk/warnings?location=+Sudbury"
            size="mini"
            icon="external"
          >
            Environment&nbsp;Agency
          </Button>
          <Button
            href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings"
            size="mini"
            icon="external"
          >
            Met&nbsp;Office
          </Button>
        </div>
        {safety.status.date && (
          <div className="mt-10 text-xs">
            Updated <DateTimeFormatter dateString={safety.status.date} />
          </div>
        )}
      </div>
    </div>
  );
}
