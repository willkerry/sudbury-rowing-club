import useSWR from "swr";
import { z } from "zod";

export const useFuzzyFindOfficer = (query?: string) =>
  useSWR(
    query ? `api/officer?q=${query}` : null,
    async (url) =>
      z
        .object({
          _id: z.string(),
          name: z.string(),
          role: z.string(),
        })
        .parse(await fetch(url).then((res) => res.json())),
    {},
  );
