import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { sanityClient } from "@sudburyrc/api";

const useGroqQuery = <T>(
  query: string,
  params: Parameters<typeof sanityClient.fetch>[1] = {},
  options?: Omit<UseQueryOptions<T>, "queryFn" | "queryKey">,
) =>
  useQuery({
    queryKey: [query, params],
    queryFn: async () => sanityClient.fetch<T>(query, params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export default useGroqQuery;
