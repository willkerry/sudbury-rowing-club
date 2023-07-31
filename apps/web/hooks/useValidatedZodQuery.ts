import { z } from "zod";
import useGroqQuery from "./useQroqQuery";

const useValidatedZodQuery = <T, U extends z.ZodTypeDef>(
  query: string,
  schema: z.ZodType<T, U>,
  params?: any
) => {
  const { data, ...rest } = useGroqQuery<T>(query, params);

  const result = schema.safeParse(data);
  if (!result.success) return { data, ...rest, error: result.error };

  return { data: result.data, ...rest };
};

export default useValidatedZodQuery;
