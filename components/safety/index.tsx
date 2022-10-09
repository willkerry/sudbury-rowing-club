import Loading from "../stour/loading";
import SafetyComponent from "./safety-component";
import getSafetyStatus from "@/lib/get-safety-status";
import useSWR from "swr";

const SafetyCard: React.FC = () => {
  const fetcher = () => getSafetyStatus();

  const { data: safetyComponentProps } = useSWR("getSafetyStatus", fetcher);

  return (
    <div className="overflow-hidden border rounded">
      {safetyComponentProps ? (
        <SafetyComponent {...safetyComponentProps} />
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default SafetyCard;
