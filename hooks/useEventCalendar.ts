import useZodSWR from "@/lib/zod-swr";
import { ZSRCEvent } from "pages/api/events";
import { z } from "zod";

const useEventCalendar = () => {
  const { data, error } = useZodSWR(z.array(ZSRCEvent), "../api/events");

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useEventCalendar;
