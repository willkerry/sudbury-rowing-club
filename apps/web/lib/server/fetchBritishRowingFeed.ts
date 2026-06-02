import { decode } from "he";
import { z } from "zod";
import { cached } from "./cached";

const QUERY_URL =
  "https://www.britishrowing.org/wp-json/wp/v2/posts?_fields=id,title,date,link&per_page=12";

const schema = z.array(
  z.object({
    date: z.coerce.date().transform((date) => date.toISOString()),
    id: z.int(),
    link: z.url(),
    title: z
      .object({ rendered: z.string() })
      .transform(({ rendered }) => decode(rendered)),
  }),
);

export type BRArticle = z.infer<typeof schema>[number];

export const fetchBritishRowingFeed = () =>
  cached({
    checkValue: schema,
    key: "british-rowing-feed",
    ttl: 60 * 60 * 12,
    getFreshValue: async () => {
      const response = await fetch(QUERY_URL);

      if (!response.ok) {
        throw new Error("British Rowing API request failed");
      }

      const feed = schema.safeParse(await response.json());

      if (!feed.success) {
        throw new Error("Unparseable response provided by British Rowing API");
      }

      return feed.data;
    },
  });
