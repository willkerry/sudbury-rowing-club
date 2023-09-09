import { sanityClient } from "@sudburyrc/api";
import useSWR from "swr";

const useGroqQuery = <T>(query: string, params?: any) =>
  useSWR(query, async () => sanityClient.fetch<T>(query, params), {
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });

export default useGroqQuery;
