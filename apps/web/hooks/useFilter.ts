import { useEffect, useState } from "react";

export const useFilter = <
  TObject extends Record<string, unknown>,
  TKeyInObject extends keyof TObject,
>(
  arrayOfObjects: TObject[],
  key: TKeyInObject,
  value: TObject[TKeyInObject],
  unfilteredString = "",
) => {
  const [filteredArray, setFilteredArray] = useState<TObject[]>(arrayOfObjects);

  useEffect(() => {
    if (value === unfilteredString) setFilteredArray(arrayOfObjects);
    else {
      setFilteredArray(
        arrayOfObjects.filter((object) => object[key] === value),
      );
    }
  }, [arrayOfObjects, key, value, unfilteredString]);

  return filteredArray;
};
