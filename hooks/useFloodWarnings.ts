import { EAWarning } from "@/types/ea-warning";
import { useEffect, useMemo, useState } from "react";
import { CLUB_LOCATION } from "../lib/constants";

const useFloodWarning = () => {
  const [url, setUrl] = useState<URL>();
  const [floodWarnings, setFloodWarnings] = useState<EAWarning[]>();

  // Assemble the URL for the flood warnings API
  // Memoise to prevent the URL being rebuilt on every render
  useMemo(() => {
    const url = new URL(
      `http://environment.data.gov.uk/flood-monitoring/id/floods`
    );
    url.search = new URLSearchParams({
      lat: String(CLUB_LOCATION[0]),
      long: String(CLUB_LOCATION[1]),
      dist: String(5),
    }).toString();
    setUrl(url);
  }, []);

  // Fetch the EA flood warnings on mount
  useEffect(() => {
    fetch(url?.toString() as string).then((res) => {
      res.json().then((data) => setFloodWarnings(data.items));
    });
  }, [url]);

  if (!floodWarnings) return null;

  return floodWarnings[0];
};

export default useFloodWarning;
