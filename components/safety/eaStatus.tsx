import { EAWarning } from "@/types/ea-warning";
import { EnvironmentAgency } from "../icons";
import Label from "../stour/label";
import DateFormatter from "../utils/date-formatter";

type EAStatusProps = {
  warning: EAWarning;
};

const EAStatus: React.FC<EAStatusProps> = ({ warning }: EAStatusProps) => {
  if (!warning) return null;
  const date = <DateFormatter dateString={warning.timeRaised} format="time" />;
  return (
    <div className="prose prose-blockquote:text-sm">
      <p>
        The Environment Agency issued an alert for our river on {date}. Right
        now, the severity is ‘{warning.severity}’. The Environment Agency says:
      </p>
      <blockquote className="relative overflow-hidden">
        <div className="absolute top-0 right-0 flex items-center justify-center p-1 bg-green-600 rounded-bl text-green-50">
          <EnvironmentAgency className="w-3 h-3" />
        </div>
        <p>{warning.message}</p>
      </blockquote>
    </div>
  );
};

export default EAStatus;
