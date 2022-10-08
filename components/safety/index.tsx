import EAStatus from "./eaStatus";
import { Severity } from "@/types/severity";
import useFloodWarning from "@/hooks/useFloodWarnings";
import useSafetyStatus from "@/hooks/useSafetyStatus";
import Loading from "../stour/loading";
import SafetyComponent, { type SafetyComponentProps } from "./safety-component";

const SafetyCard: React.FC = () => {
  // Fetch the latest flood warning from the Environment Agency
  const { data, error, loading } = useSafetyStatus();

  if (error) console.error(error);

  // Fetch the manual safety status from Sanity CMS
  const floodWarning = useFloodWarning();

  let safetyComponentProps: SafetyComponentProps = {
    description: null,
    status: Severity.neutral,
    statusMessage: "No data",
  };

  // Pick the warning to display based on some logic

  if (loading) {
    // A loading state
    safetyComponentProps = {
      description: <Loading />,
      status: Severity.neutral,
      statusMessage: "Loading...",
    };
  } else if (data?.display) {
    // The manual safety status from Sanity CMS
    safetyComponentProps = {
      description: data.description,
      date: data._updatedAt,
      status: data.status,
      statusMessage: data.status,
    };
  } else if (floodWarning) {
    // The EA flood warning if there is one
    safetyComponentProps = {
      description: <EAStatus warning={floodWarning} />,
      date: floodWarning.timeRaised,
      status: {
        1: Severity.red,
        2: Severity.red,
        3: Severity.amber,
        4: Severity.neutral,
      }[floodWarning.severityLevel],
      statusMessage: floodWarning.severity,
    };
  } else {
    // No data
    safetyComponentProps = {
      description: (
        <p>We don’t have any data on the safety of the river at the moment.</p>
      ),
      status: Severity.neutral,
      statusMessage: "No data",
    };
  }

  return (
    <div className="overflow-hidden border rounded">
      <SafetyComponent {...safetyComponentProps} />
    </div>
  );
};

export default SafetyCard;
