import sanityClient from "@/lib/sanity.server";
import { useEffect, useState } from "react";

const useGroqQuery = <T>(query: string, params?: any) => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: T = await sanityClient.fetch(query, params);
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, params]);

  return { data, error, loading };
};

export default useGroqQuery;
