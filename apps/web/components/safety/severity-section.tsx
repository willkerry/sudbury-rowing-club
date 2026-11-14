import {
  IconAlertCircle,
  IconExclamationCircleFilled,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types/severity";
import { LoadingText } from "../stour/loading-text/loading-text";

export const IS_LOADING = "Loading...";

type SeveritySectionProps = {
  status: Severity;
  message?: string;
  isUnavailable?: boolean;
};

const SEVERITY_CLASSES: Record<Severity, string> = {
  amber: "text-yellow-600 bg-yellow-50",
  green: "text-green-600 bg-green-50",
  neutral: "text-gray-800 bg-gray-50",
  red: "text-red-600 bg-red-50",
};

const getMessage = (status: Severity, message?: string) => {
  if (message === IS_LOADING) return <LoadingText />;
  if (message) return <>{message}</>;

  return <>{status.charAt(0).toUpperCase() + status.slice(1)}</>;
};

export const SeveritySection = ({
  status,
  message,
  isUnavailable = false,
}: SeveritySectionProps) => {
  const isWarning = status === "red" || status === "amber";

  return (
    <div
      className={cn(
        "flex min-h-12 items-center justify-between gap-3 p-3 text-2xl font-bold tracking-tight sm:min-h-16 sm:p-4 md:text-3xl",
        isUnavailable ? "bg-gray-100 text-gray-900" : SEVERITY_CLASSES[status],
      )}
    >
      {getMessage(status, message)}

      {isWarning && (
        <div className="relative size-6 shrink-0">
          {/* Two pulses announce the warning; constant motion would soon go unnoticed */}
          <div className="absolute inset-0.5 z-0 size-5 rounded-full bg-current motion-safe:animate-ping motion-safe:[animation-fill-mode:forwards] motion-safe:[animation-iteration-count:2]" />
          <div className="absolute inset-1 z-0 size-4 rounded-full bg-white" />
          <IconExclamationCircleFilled
            aria-hidden
            className="absolute z-10 size-6"
          />
        </div>
      )}

      {isUnavailable && (
        <IconAlertCircle
          aria-hidden
          className="size-6 shrink-0 text-gray-500"
        />
      )}
    </div>
  );
};
