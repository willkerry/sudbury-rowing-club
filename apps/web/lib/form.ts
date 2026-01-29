import { HTTPError } from "ky";

export function getErrorMessage(
  error: string | { message: string } | undefined,
): string | undefined {
  if (!error) return undefined;
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
      if (err instanceof HTTPError && err.response.status === 400) {
        const fieldErrors = JSON.parse(err.message) as Partial<
          Record<keyof T, string>
        >;

        return { fields: fieldErrors };
      }

      return null;
    }
  };
}
