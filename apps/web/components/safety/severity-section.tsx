import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import type { Severity } from "@/types/severity";
import { LoadingText } from "../stour/loading-text/loading-text";

export const IS_LOADING = "Loading...";

type SeveritySectionProps = {
  status: Severity;
  message?: string;
};

const getMessage = (status: Severity, message?: string) => {
  if (message === IS_LOADING) return <LoadingText />;
  if (message) return <>{message}</>;

  return <>{status.charAt(0).toUpperCase() + status.slice(1)}</>;
};

export const SeveritySection = ({ status, message }: SeveritySectionProps) => {
  const severityClasses: Record<Severity, string> = {
    amber: "text-yellow-500 bg-yellow-50",
    green: "text-green-500 bg-green-50",
    neutral: "text-gray-500 bg-gray-50",
    red: "text-red-500 bg-red-50",
  };

  return (
    <div
      className={`${severityClasses[status]} flex h-12 items-center justify-between p-3 font-bold text-2xl sm:h-16 sm:p-4 md:text-3xl`}
    >
      {getMessage(status, message)}

      {status === "red" || status === "amber" ? (
        <div className="relative h-6 w-6">
          <div className="absolute inset-0.5 z-0 h-5 w-5 animate-ping rounded-full bg-current" />
          <div className="absolute inset-1 z-0 h-4 w-4 rounded-full bg-white" />
          <ExclamationCircleIcon
            aria-hidden
            className="absolute z-10 h-6 w-6"
          />
        </div>
      ) : null}
    </div>
  );
};
