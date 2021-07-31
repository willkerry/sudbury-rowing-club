import safety from "@/data/safety.json";
import DateTimeFormatter from "../datetime-formatter";
import cn from "classNames";
import Button from "../stour/button";

export default function SafetyPopup() {
  return (
    <div className="flex p-6">
      <div>
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
        <h3 className="my-1.5 text-3xl font-bold text-gray-900">
          {safety.status.severity}
        </h3>
        <div className="space-y-4 prose">
          <div>{safety.status.description}</div>
          {safety.status.date && (
            <div className="text-xs">
              Updated <DateTimeFormatter dateString={safety.status.date} />
            </div>
          )}
          <div className="flex flex-col pt-4 text-sm lg:flex-row lg:space-y-0 lg:space-x-2">
            <Button
              label="Environment&nbsp;Agency"
              href="https://flood-warning-information.service.gov.uk/warnings?location=+Sudbury"
              size="mini"
              icon="external"
            />
            <Button
              label="Met&nbsp;Office"
              href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings"
              size="mini"
              icon="external"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
