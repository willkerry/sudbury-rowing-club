import Loading from "../stour/loading";
import SafetyComponent, { type SafetyComponentProps } from "./safety-component";
import getSafetyStatus from "@/lib/get-safety-status";
import { useEffect, useState } from "react";

const SafetyCard: React.FC = () => {
  const [safetyComponentProps, setSafetyComponentProps] =
    useState<SafetyComponentProps>();

  useEffect(() => {
    const fetchSafetyStatus = async () => {
      const safetyStatus = await getSafetyStatus();
      if (safetyStatus) setSafetyComponentProps(safetyStatus);
    };
    fetchSafetyStatus();
  }, []);

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
