import type { UseQueryOptions } from "@tanstack/react-query";
import type { z } from "zod";
import useGroqQuery from "./useQroqQuery";

const useValidatedZodQuery = <T, U extends z.ZodTypeDef>(
  query: string,
  schema: z.ZodType<T, U>,
  params?: Parameters<typeof useGroqQuery>[1],
  options?: Omit<UseQueryOptions<T>, "queryFn" | "queryKey">,
) => {
  const { data, ...rest } = useGroqQuery<T>(query, params, options);

  const result = schema.safeParse(data);
  if (!result.success) return { data, ...rest, error: result.error };

  return { data: result.data, ...rest };
};

export default useValidatedZodQuery;
