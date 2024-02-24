import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Severity } from "@/types/severity";

type SeveritySectionProps = {
  status: Severity;
  message?: string;
};

const SeveritySection = ({ status, message }: SeveritySectionProps) => {
  const severityClasses = {
    [Severity.red]: "text-red-500 bg-red-50",
    [Severity.amber]: "text-yellow-500 bg-yellow-50",
    [Severity.green]: "text-green-500 bg-green-50",
    [Severity.neutral]: "text-gray-500 bg-gray-50",
  };

  return (
    <div
      className={`${severityClasses[status]}  flex h-12 items-center justify-between p-3 text-2xl font-bold tracking-tight sm:h-16 sm:p-4 md:text-3xl `}
    >
      {message || status.charAt(0).toUpperCase() + status.slice(1)}

      {status === Severity.red || status === Severity.amber ? (
        <div className="relative h-6 w-6">
          <div className="absolute inset-0.5 z-0 h-5 w-5 animate-ping rounded-full bg-current" />
          <div className="absolute inset-1 z-0 h-4 w-4 rounded-full bg-white " />
          <ExclamationCircleIcon className="absolute z-10 h-6 w-6" />
        </div>
      ) : null}
    </div>
  );
};

export default SeveritySection;
