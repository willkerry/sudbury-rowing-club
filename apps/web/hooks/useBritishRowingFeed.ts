import { z } from "zod";
import useZodSWR from "@/lib/zod-swr";

const KEY = "british-rowing-feed";
const QUERY_URL =
  "https://www.britishrowing.org/wp-json/wp/v2/posts?_fields=id,title,date,link&per_page=12";

const schema = z.array(
  z.object({
    id: z.number(),
    title: z.object({
      rendered: z.string(),
    }),
    date: z.coerce.date(),
    link: z.string(),
  }),
);
const useBritishRowingFeed = () =>
  useZodSWR(schema, [KEY], async () => (await fetch(QUERY_URL)).json());

export type BRArticle = z.infer<typeof schema>[number];

export default useBritishRowingFeed;
