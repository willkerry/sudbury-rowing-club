import type { z } from "zod";

export class ValidationError extends Error {
  constructor(public errors: Record<string, string>) {
    super("Validation error");
  }
}

export function parseWithFieldErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]);
      fieldErrors[field] ??= issue.message;
    }
    throw new ValidationError(fieldErrors);
  }

  return result.data;
}
