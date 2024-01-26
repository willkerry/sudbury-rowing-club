import getSafetyStatus from "@/lib/get-safety-status";
import { useQuery } from "@tanstack/react-query";
import Loading from "../stour/loading";
import SafetyComponent from "./safety-component";

const SafetyBorder = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-hidden rounded border">{children}</div>
);

const SafetyCard = () => {
  const { data: safetyComponentProps, status } = useQuery<
    Awaited<ReturnType<typeof getSafetyStatus>>
  >({
    queryKey: ["/api/safety"],
    queryFn: () => fetch("/api/safety").then((res) => res.json()),
  });

  switch (status) {
    case "error":
      return (
        <SafetyBorder>
          <div className="mx-auto flex h-96 items-center justify-center p-4 text-sm font-medium">
            Failed to load river safety status.
          </div>
        </SafetyBorder>
      );

    case "success":
      return (
        <SafetyBorder>
          <SafetyComponent {...safetyComponentProps} />
        </SafetyBorder>
      );

    default:
      return (
        <SafetyBorder>
          <div className="h-96">
            <Loading />
          </div>
        </SafetyBorder>
      );
  }
};

export default SafetyCard;
