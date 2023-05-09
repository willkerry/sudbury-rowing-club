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
  fetcher: Fetcher<z.infer<T>> = (url: string) =>
    fetch(url).then((res) => res.json()),
  config?: SWRConfiguration<z.infer<T>, any>
) => {
  const { data, error } = useSWR(key, fetcher, config);

  const parse = schema.safeParse(data);

  if (data && parse.success === false) {
    throw new Error(`Date does not match the schema. ${parse.error}`);
  }

  return { data, error };
};

export default useZodSWR;
