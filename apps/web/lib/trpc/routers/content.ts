import { sanityClient, ZTypedObject } from "@sudburyrc/api";
import { getWodehouseFullDetails } from "get-wodehouse-name";
import groq from "groq";
import { z } from "zod";
import { cached } from "@/lib/server/cached";
import { fetchBritishRowingFeed } from "@/lib/server/fetchBritishRowingFeed";
import { rateLimitedProcedure, router } from "../init";

const NOTICE_CACHE_SECONDS = 60;
const FEED_CACHE_SECONDS = 60 * 60;

const NoticeSchema = z.object({
  date: z
    .string()
    .optional()
    .refine((s) => !(s && Number.isNaN(Date.parse(s)))),
  display: z.boolean(),
  includeTime: z.boolean().optional(),
  label: z.string(),
  link: z.string().optional(),
  text: z.array(ZTypedObject).optional(),
  type: z.enum(["primary", "secondary", "success", "warning", "error"]),
});

export type Notice = z.infer<typeof NoticeSchema>;

export const contentRouter = router({
  feed: rateLimitedProcedure
    .meta({ cacheSeconds: FEED_CACHE_SECONDS })
    .query(fetchBritishRowingFeed),
  notice: rateLimitedProcedure
    .meta({ cacheSeconds: NOTICE_CACHE_SECONDS })
    .query(() =>
      cached({
        checkValue: NoticeSchema,
        key: "regatta-notice",
        staleWhileRevalidate: NOTICE_CACHE_SECONDS * 1000,
        ttl: NOTICE_CACHE_SECONDS * 1000,
        getFreshValue: () =>
          sanityClient.fetch(groq`*[_type == "regattaSettings"][0].note`),
      }),
    ),
  pg: rateLimitedProcedure.query(getWodehouseFullDetails),
});
