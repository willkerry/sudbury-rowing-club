import { TRPCClientError } from "@trpc/client";

export function getErrorMessage(
  error: string | { message: string } | undefined,
): string | undefined {
  if (!error) return;
  if (typeof error === "string") return error;

  return error.message;
}

export function withServerValidation<T>(
  mutateAsync: (value: T) => Promise<unknown>,
) {
  return async ({ value }: { value: T }) => {
    try {
      await mutateAsync(value);

      return null;
    } catch (err) {
      if (err instanceof TRPCClientError && err.data?.zodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        const zodFieldErrors = err.data.zodError.fieldErrors as Record<
          string,
          string[] | undefined
        >;

        for (const [field, messages] of Object.entries(zodFieldErrors)) {
          if (messages?.[0]) {
            fieldErrors[field as keyof T] = messages[0];
          }
        }

        return { fields: fieldErrors };
      }

      return null;
    }
  };
}
