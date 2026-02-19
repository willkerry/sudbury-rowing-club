import {
  type QueryFunction,
  type QueryKey,
  type UndefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";
import type { z } from "zod";

/**
 * A type-safe version of useQuery. It takes a Zod schema as the first argument, validates the fetch result against it, and returns the result as a Zod type.
 */
export const useZodSWR = <T extends z.ZodTypeAny>(
  schema: T,
  key: QueryKey,
  fetcher: QueryFunction<z.infer<T>>,
  config?: Omit<
    UndefinedInitialDataOptions<z.infer<T>>,
    "queryKey" | "queryFn" | "select"
  >,
) => {
  const { data, error, ...rest } = useQuery({
    queryFn: fetcher,
    queryKey: key,
    select: (data) => {
      const parse = schema.safeParse(data);

      if (data && parse.success === false) {
        throw new Error("Data do not match the schema.");
      }

      return data;
    },
    ...config,
  });

  return { data, error, ...rest };
};
