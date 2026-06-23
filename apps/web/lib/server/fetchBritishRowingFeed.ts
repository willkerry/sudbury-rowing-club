import { decode } from "he";
import { tryit } from "radashi";
import { z } from "zod";
import { cached } from "./cached";
import { firecrawl } from "./firecrawl";

const QUERY_URL =
  "https://www.britishrowing.org/wp-json/wp/v2/posts?_fields=id,title,date,link&per_page=12";

const schema = z.array(
  z.object({
    date: z.coerce.date(),
    id: z.int(),
    link: z.url(),
    title: z
      .object({ rendered: z.string() })
      .transform(({ rendered }) => decode(rendered)),
  }),
);

const transformedSchema = z.array(
  z.object({
    date: z.coerce.date(),
    id: z.int(),
    link: z.url(),
    title: z.string(),
  }),
);

export type BRArticle = z.infer<typeof transformedSchema>[number];

export const fetchBritishRowingFeed = () =>
  cached({
    checkValue: transformedSchema,
    key: "british-rowing-feed",
    ttl: 1000 * 60 * 60 * 12,
    getFreshValue: async () => {
      const page = await firecrawl.scrape(QUERY_URL, {
        formats: ["rawHtml"],
      });

      const rawHtml = page.rawHtml;

      if (!rawHtml) {
        throw new Error("Failed to scrape British Rowing feed");
      }

      if (!page.rawHtml) {
        throw new Error("Failed to scrape British Rowing feed");
      }

      const [parsedError, parsed] = await tryit(
        async () => await JSON.parse(rawHtml),
      )();

      if (parsedError) {
        throw new Error("Failed to parse British Rowing feed");
      }

      const feed = schema.safeParse(parsed);

      if (!feed.success) {
        throw new Error("Unparseable response provided by British Rowing API");
      }

      return feed.data;
    },
  });
