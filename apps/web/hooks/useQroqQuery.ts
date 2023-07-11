import sanityClient from "@/lib/sanity.server";
import useSWR from "swr";

const useGroqQuery = <T>(query: string, params?: any) =>
  useSWR(query, async () => sanityClient.fetch<T>(query, params));

export default useGroqQuery;
