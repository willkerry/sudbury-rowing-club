import getSafetyStatus from "@/lib/get-safety-status";
import type { Severity } from "@/types/severity";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { Suspense } from "react";
import { EnvironmentAgency, MetOffice } from "../icons";
import { Label } from "../stour/label";
import { Loading } from "../stour/loading";
import { Error as ErrorComponent } from "../ui/error";
import { DateFormatter } from "../utils/date-formatter";
import { ForecastComponent } from "./forecast";
import { QuotedWarning, type WarningSourceEnum } from "./quoted-warning";
import { SeveritySection } from "./severity-section";

export type SafetyComponentProps = {
  description: string;
  date?: Date;
  status: Severity;
  statusMessage: string;
  source?: WarningSourceEnum;
  errors?: string[];
};

export const SafetyComponent = async () => {
  const { description, date, status, statusMessage, source, errors } =
    await getSafetyStatus();

  return (
    <div className="divide-y">
      <div className="p-3 sm:p-4">
        <Label as="h2">River Safety Status</Label>
      </div>

      <SeveritySection status={status} message={statusMessage} />

      <div className="p-3 sm:p-4">
        {source ? <QuotedWarning {...{ description, source }} /> : description}
        {date && (
          <div className="disambiguate mt-4 font-medium text-gray-500 text-sm">
            Updated <DateFormatter dateString={date} format="time" />
          </div>
        )}
      </div>

      {Number(errors?.length) > 0 && (
        <div className="p-3 sm:p-4">
          {errors?.map((error) => (
            <ErrorComponent key={error} error={{ message: error }} />
          ))}
        </div>
      )}

      <Suspense fallback={<Loading />}>
        <ForecastComponent />
      </Suspense>

      <div className="grid grid-flow-col grid-cols-2 divide-x">
        <a
          href="https://check-for-flooding.service.gov.uk/location/sudbury-suffolk"
          className="group flex h-14 items-center justify-between bg-gray-50 px-4 text-gray-500 text-sm transition duration-300 hover:bg-white hover:text-black"
        >
          <EnvironmentAgency aria-hidden className="h-4 w-4" />
          EA Floods
          <ArrowTopRightOnSquareIcon
            aria-hidden
            className="h-4 w-4 opacity-30 transition duration-300 group-hover:opacity-70"
          />
        </a>
        <a
          href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings"
          className="group flex h-14 items-center justify-between bg-gray-50 px-4 text-gray-500 text-sm transition duration-300 hover:bg-white hover:text-black"
        >
          <div className="w-0">
            <MetOffice aria-hidden className="h-4 w-4" />
          </div>
          Met Office
          <ArrowTopRightOnSquareIcon
            aria-hidden
            className="h-4 w-4 opacity-30 transition duration-300 group-hover:opacity-70"
          />
        </a>
      </div>
    </div>
  );
};
