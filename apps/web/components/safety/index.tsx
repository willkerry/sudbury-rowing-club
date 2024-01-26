import getSafetyStatus from "@/lib/get-safety-status";
import { useQuery } from "@tanstack/react-query";
import Loading from "../stour/loading";
import SafetyComponent from "./safety-component";

const SafetyCard = () => {
  const { data: safetyComponentProps, status } = useQuery<
    Awaited<ReturnType<typeof getSafetyStatus>>
  >({
    queryKey: ["getSafetyStatus"],
    queryFn: () => fetch("/api/safety").then((res) => res.json()),
  });

  return (
    <div className="overflow-hidden rounded border">
      {status === "pending" && (
        <div className="p-4">
          <Loading />
        </div>
      )}

      {status === "success" && <SafetyComponent {...safetyComponentProps} />}

      {status === "error" && (
        <div className="mx-auto p-4 text-sm">
          <p>Sorry, we couldn’t load the river safety status.</p>
        </div>
      )}
    </div>
  );
};

export default SafetyCard;
