import { useMemo } from "react";

export const useFilter = <
  TObject extends Record<string, unknown>,
  TKeyInObject extends keyof TObject,
>(
  arrayOfObjects: TObject[],
  key: TKeyInObject,
  value: TObject[TKeyInObject],
  unfilteredString = "",
) =>
  useMemo(() => {
    if (value === unfilteredString) return arrayOfObjects;

    return arrayOfObjects.filter((object) => object[key] === value);
  }, [arrayOfObjects, key, value, unfilteredString]);
