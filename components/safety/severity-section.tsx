import { Severity } from "@/types/severity";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

type SeveritySectionProps = {
  status: Severity;
  message?: string;
};

const SeveritySection: React.FC<SeveritySectionProps> = ({
  status,
  message,
}) => {
  const severityClasses = {
    [Severity.red]: "text-red-500 bg-red-50",
    [Severity.amber]: "text-yellow-500 bg-yellow-50",
    [Severity.green]: "text-green-500 bg-green-50",
    [Severity.neutral]: "text-gray-500 bg-gray-50",
  };
  return (
    <div
      className={`${severityClasses[status]} flex items-center justify-between h-24 p-4 text-4xl font-bold tracking-tight capitalize`}
    >
      {message || status}

      {status === Severity.red || status === Severity.amber ? (
        <div className="relative w-6 h-6">
          <div className="absolute z-0 w-5 h-5 bg-current rounded-full inset-0.5 animate-ping" />
          <div className="absolute z-0 w-4 h-4 bg-white rounded-full inset-1 " />
          <ExclamationCircleIcon className="absolute z-10 w-6 h-6" />
        </div>
      ) : null}
    </div>
  );
};

export default SeveritySection;
