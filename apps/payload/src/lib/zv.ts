import type { ZodType } from "zod";

export const zv =
  (schema: ZodType) =>
  (v: unknown): string | true => {
    const result = schema.safeParse(v);

    if (!result.success) {
      return result.error.issues.map((issue) => issue.message).join(" ");
    }

    return true;
  };
