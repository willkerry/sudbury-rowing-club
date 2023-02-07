import type { Fetcher, Key, SWRConfiguration } from "swr";
import useSWR from "swr";
import { z } from "zod";

/**
 * A type-safe version of useSWR. It takes a Zod schema as the first argument, validates the fetch result against it, and returns the result as a Zod type.
 *
 * @param schema The Zod schema to validate the fetch result against
 * @param key The key to fetch
 * @param fetcher The fetcher function
 * @param config The SWR configuration
 * @returns The result of the fetcher function, validated against the schema
 * @example
 * const schema = z.object({
 *  name: z.string(),
 *  age: z.number(),
 * });
 *
 * const { data, error } = useZodSWR(schema, "user", () => {
 *      fetch("/api/user").then(res => res.json()
 *     }
 * ));
 * // typeof data === z.infer<typeof schema>
 */
const useZodSWR = <T extends z.ZodType<any, any>>(
  schema: T,
  key: Key,
  fetcher: Fetcher<z.infer<T>>,
  config?: SWRConfiguration<z.infer<T>, any>
) => {
  const { data, error } = useSWR(key, fetcher, config);

  if (data && !schema.safeParse(data).success) {
    throw new Error("Data does not match schema");
  }

  return { data, error };
};

export default useZodSWR;
