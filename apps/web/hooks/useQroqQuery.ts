import { sanityClient } from "@sudburyrc/api";
import { useQuery } from "@tanstack/react-query";

const useGroqQuery = <T>(query: string, params?: any) =>
  useQuery({
    queryKey: [query, params],
    queryFn: async () => sanityClient.fetch<T>(query, params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
  });

export default useGroqQuery;
