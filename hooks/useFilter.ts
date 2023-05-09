import { useEffect, useState } from "react";

const useFilter = <TObject extends Object, TKeyInObject extends keyof TObject>(
  arrayOfObjects: TObject[],
  key: TKeyInObject,
  value: TObject[TKeyInObject]
) => {
  const [filteredArray, setFilteredArray] = useState<TObject[]>(arrayOfObjects);

  useEffect(() => {
    if (value === "") setFilteredArray(arrayOfObjects);
    else {
      setFilteredArray(
        arrayOfObjects.filter((object) => object[key] === value)
      );
    }
  }, [arrayOfObjects, key, value]);

  return filteredArray;
};

export default useFilter;
