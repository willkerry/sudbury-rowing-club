"use client";

import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import type { QueryStatus } from "@tanstack/react-query";
import { EnvironmentAgency, MetOffice } from "@/components/icons";
import { Label } from "@/components/stour/label";
import { Error as ErrorComponent } from "@/components/ui/error";
import { DateFormatter } from "@/components/utils/date-formatter";
import { useTrackLoadTime } from "@/hooks/useTrackLoadTime";
import { trpc } from "@/lib/trpc/client";
import type { Severity } from "@/types/severity";
import { Loading } from "../stour/loading";
import { ForecastComponent } from "./forecast";
import { QuotedWarning, type WarningSourceEnum } from "./quoted-warning";
import { IS_LOADING, SeveritySection } from "./severity-section";

export type SafetyComponentProps = {
  description: string;
  date?: Date;
  retrievedAt?: Date;
  status: Severity;
  statusMessage: string;
  source?: WarningSourceEnum;
  errors?: string[];
};

const SafetyDateUpdated = ({
  date,
  retrievedAt,
}: {
  date?: Date;
  retrievedAt?: Date;
}) => {
  const hasTimestamps = Boolean(date || retrievedAt);
  if (!hasTimestamps) return null;

  const isSameDay =
    date &&
    retrievedAt &&
    new Date(date).toDateString() === new Date(retrievedAt).toDateString();

  return (
    <div className="disambiguate mt-4 font-medium text-gray-500 text-sm">
      {date && (
        <>
          Published <DateFormatter dateString={date} format="time" />
          {retrievedAt && (
            <>
              {" "}
              (Retrieved{" "}
              <DateFormatter
                dateString={retrievedAt}
                format={
                  isSameDay ? { hour: "numeric", minute: "numeric" } : "time"
                }
              />
              )
            </>
          )}
        </>
      )}
      {!date && retrievedAt && (
        <>
          Retrieved <DateFormatter dateString={retrievedAt} format="time" />
        </>
      )}
    </div>
  );
};

const SafetyDescription = ({
  description,
  source,
}: Partial<Pick<SafetyComponentProps, "description" | "source">>) => {
  if (source && description) {
    return <QuotedWarning description={description} source={source} />;
  }

  if (description) return <>{description}</>;

  return null;
};

export const SafetyComponent = () => {
  const { data, status, error } = trpc.safety.status.useQuery();

  useTrackLoadTime(status, {
    successEvent: "safety_api_response",
    errorEvent: "safety_api_request_failed",
    successProperties: {
      status: data?.status,
      status_message: data?.statusMessage,
      has_partial_errors: (data?.errors?.length ?? 0) > 0,
    },
    error,
  });

  const severityStatusMap: Record<QueryStatus, SafetyComponentProps["status"]> =
    {
      pending: "neutral",
      error: "neutral",
      success: data?.status || "neutral",
    };
  const severityStatus = severityStatusMap[status];

  const statusMessageMap: Record<
    QueryStatus,
    SafetyComponentProps["statusMessage"] | undefined
  > = {
    pending: IS_LOADING,
    error: "Error",
    success: data?.statusMessage,
  };
  const statusMessage = statusMessageMap[status];

  return (
    <div className="divide-y">
      <div className="p-3 sm:p-4">
        <Label as="h2">River Safety Status</Label>
      </div>

      <SeveritySection status={severityStatus} message={statusMessage} />

      <div className="min-h-22 p-3 sm:p-4">
        {status === "pending" ? (
          <Loading className="h-22" />
        ) : (
          <>
            <SafetyDescription
              description={data?.description}
              source={data?.source}
            />
            <SafetyDateUpdated
              date={data?.date}
              retrievedAt={data?.retrievedAt}
            />
          </>
        )}
      </div>

      {(Number(data?.errors?.length) > 0 || error) && (
        <div className="p-3 sm:p-4">
          {data?.errors?.map((error) => (
            <ErrorComponent key={error} error={{ message: error }} />
          ))}

          {error && <ErrorComponent error={{ message: error.message }} />}
        </div>
      )}

      <ForecastComponent />

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
