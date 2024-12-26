import { decode } from "he";
import { z } from "zod";

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

export type BRArticle = z.infer<typeof schema>[number];

export const fetchBritishRowingFeed = async () => {
  const response = await fetch(QUERY_URL);

  if (!response.ok) {
    throw new Error("British Rowing API request failed");
  }

  const feed = schema.safeParse(await response.json());

  if (!feed.success) {
    throw new Error("Unparseable response provided by British Rowing API");
  }

  for (const item of feed.data) {
    item.title.rendered = decode(item.title.rendered);
  }

  return feed.data;
};
