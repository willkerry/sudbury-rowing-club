import getSafetyStatus from "@/lib/get-safety-status";
import useSWR from "swr";
import Loading from "../stour/loading";
import SafetyComponent from "./safety-component";

const SafetyCard: React.FC = () => {
  const fetcher: typeof getSafetyStatus = () =>
    fetch("/api/safety").then((res) => res.json());

  const { data: safetyComponentProps } = useSWR("getSafetyStatus", fetcher);

  return (
    <div className="overflow-hidden rounded border">
      {safetyComponentProps ? (
        <SafetyComponent {...safetyComponentProps} />
      ) : (
        <div className="px-4">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default SafetyCard;
