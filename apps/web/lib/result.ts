/**
 * A discriminated union for operations that must degrade gracefully rather
 * than throw. Narrow on `ok` to reach `data` or `error`.
 */
export type Result<T, E = string> =
  | {
      ok: true;
      data: T;
      error?: never;
    }
  | {
      ok: false;
      data?: never;
      error: E;
    };

export const ok = <T>(data: T): Result<T, never> => ({ data, ok: true });

export const err = <E>(error: E): Result<never, E> => ({ error, ok: false });
