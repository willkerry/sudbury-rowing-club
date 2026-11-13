"use client";

import { type QueryStatus, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Label } from "@/components/stour/label";
import { useTrackLoadTime } from "@/hooks/useTrackLoadTime";
import type { RiverReadings } from "@/lib/river-level";
import { formatAgo, formatWhen } from "@/lib/safety-times";
import { useTRPC } from "@/lib/trpc/client";
import type { Severity } from "@/types/severity";
import { Loading } from "../stour/loading";
import { HourlyForecast } from "./hourly-forecast";
import { QuotedWarning, type WarningSourceEnum } from "./quoted-warning";
import { RiverGauge } from "./river-gauge";
import { IS_LOADING, SeveritySection } from "./severity-section";

export type SafetyKind = "club" | "flood" | "weather" | "river" | "unavailable";

export type SafetyComponentProps = {
  description: string;
  date?: Date;
  retrievedAt?: Date;
  status: Severity;
  statusMessage: string;
  kind: SafetyKind;
  river?: RiverReadings;
  source?: WarningSourceEnum;
  errors?: string[];
};

const TICK_MS = 30_000;

const useNow = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), TICK_MS);

    return () => clearInterval(interval);
  }, []);

  return now;
};

const DATE_LABELS: Partial<Record<SafetyKind, string>> = {
  club: "Updated",
  flood: "Issued",
  weather: "Issued",
};

const SafetyTimes = ({
  date,
  kind,
  now,
  retrievedAt,
}: Pick<SafetyComponentProps, "date" | "kind" | "retrievedAt"> & {
  now: Date;
}) => {
  const dateLabel = DATE_LABELS[kind];
  const parts = [
    dateLabel && date && `${dateLabel} ${formatWhen(new Date(date), now)}`,
    retrievedAt && `Checked ${formatAgo(new Date(retrievedAt), now)}`,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <p className="text-sm text-gray-500">
      {parts.join(" · ").replace(/^./, (first) => first.toUpperCase())}
    </p>
  );
};

const SafetyDescription = ({
  description,
  kind,
  source,
}: Pick<SafetyComponentProps, "description" | "kind" | "source">) => {
  if (!description || kind === "river") return null;
  if (source)
    return <QuotedWarning description={description} source={source} />;

  return <p className="text-gray-900">{description}</p>;
};

export const SafetyComponent = () => {
  const trpc = useTRPC();
  const now = useNow();

  const { data, status, error } = useQuery(trpc.safety.status.queryOptions());

  useTrackLoadTime(status, {
    errorEvent: "safety_api_request_failed",
    successEvent: "safety_api_response",
    successProperties: {
      has_partial_errors: (data?.errors?.length ?? 0) > 0,
      status: data?.status,
      status_message: data?.statusMessage,
    },
    error,
  });

  const severityStatusMap: Record<QueryStatus, Severity> = {
    error: "neutral",
    pending: "neutral",
    success: data?.status || "neutral",
  };

  const statusMessageMap: Record<QueryStatus, string | undefined> = {
    error: "Status unavailable",
    pending: IS_LOADING,
    success: data?.statusMessage,
  };

  const isUnavailable = status === "error" || data?.kind === "unavailable";

  return (
    <div className="divide-y">
      <div className="p-3 sm:p-4">
        <Label as="h2">River Safety Status</Label>
      </div>

      <SeveritySection
        isUnavailable={isUnavailable}
        message={statusMessageMap[status]}
        status={severityStatusMap[status]}
      />

      <div className="min-h-22 space-y-4 p-3 sm:p-4">
        {status === "pending" && <Loading className="h-22" />}

        {status === "error" && (
          <p className="text-gray-900">
            We couldn’t load the river status. Check conditions at the river
            before you go out.
          </p>
        )}

        {data && (
          <>
            <SafetyDescription
              description={data.description}
              kind={data.kind}
              source={data.source}
            />
            {data.river && <RiverGauge now={now} river={data.river} />}
            <SafetyTimes
              date={data.date}
              kind={data.kind}
              now={now}
              retrievedAt={data.retrievedAt}
            />
          </>
        )}
      </div>

      <HourlyForecast />
    </div>
  );
};
