import Loading from "../stour/loading";
import SafetyComponent from "./safety-component";
import getSafetyStatus from "@/lib/get-safety-status";
import useSWR from "swr";

const SafetyCard: React.FC = () => {
  const fetcher: typeof getSafetyStatus = () =>
    fetch("/api/safety").then((res) => res.json());

  const { data: safetyComponentProps } = useSWR("getSafetyStatus", fetcher);

  return (
    <div className="overflow-hidden border rounded">
      {safetyComponentProps ? (
        <SafetyComponent {...safetyComponentProps} />
      ) : (
        <div>
          <Loading />
          <style jsx>{`
            div {
              padding: 1rem 0;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default SafetyCard;
