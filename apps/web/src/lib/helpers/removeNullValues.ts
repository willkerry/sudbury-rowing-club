type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

type RemoveNull<T> = ExpandRecursively<{
  [K in keyof T]: Exclude<RemoveNull<T[K]>, null>;
}>;

export const removeNullValues = <T extends object>(obj: T): RemoveNull<T> =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeNullValues(v) : v]),
  ) as RemoveNull<T>;
