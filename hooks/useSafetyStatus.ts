import { Severity } from "@/types/severity";
import groq from "groq";
import useGroqQuery from "./useQroqQuery";

type SafetyStatus = {
  _updatedAt: Date;
  description: string;
  display: boolean;
  status: Severity;
};

const useSafetyStatus = () => {
  const { data, error, loading } = useGroqQuery<SafetyStatus>(
    groq`*[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{
            _updatedAt,
            description,
            display,
            status
        }`
  );

  return { data, error, loading };
};

export default useSafetyStatus;
