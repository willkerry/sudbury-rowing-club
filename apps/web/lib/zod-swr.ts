import {
  type QueryFunction,
  type QueryKey,
  type UndefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";
import { z } from "zod";

/**
 * A type-safe version of useQuery. It takes a Zod schema as the first argument, validates the fetch result against it, and returns the result as a Zod type.
 */
const useZodSWR = <T extends z.ZodType<any, any>>(
  schema: T,
  key: QueryKey,
  fetcher: QueryFunction<z.infer<T>>,
  config?: UndefinedInitialDataOptions<z.infer<T>>,
) => {
  const { data, error, ...rest } = useQuery({
    queryKey: key,
    queryFn: fetcher,
    select: (data) => {
      const parse = schema.safeParse(data);

      if (data && parse.success === false) {
        throw new Error(`Data do not match the schema.`);
      }

      return data;
    },
    ...config,
  });

  return { data, error, ...rest };
};

export default useZodSWR;
