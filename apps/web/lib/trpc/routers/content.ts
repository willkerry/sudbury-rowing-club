import { sanityClient, ZTypedObject } from "@sudburyrc/api";
import { getWodehouseFullDetails } from "get-wodehouse-name";
import groq from "groq";
import { z } from "zod";
import { fetchBritishRowingFeed } from "@/lib/server/fetchBritishRowingFeed";
import { rateLimitedProcedure, router } from "../init";

const NoticeSchema = z.object({
  display: z.boolean(),
  label: z.string(),
  text: z.array(ZTypedObject).optional(),
  type: z.enum(["primary", "secondary", "success", "warning", "error"]),
  link: z.string().optional(),
  date: z
    .string()
    .optional()
    .refine((s) => !(s && Number.isNaN(Date.parse(s)))),
  includeTime: z.boolean().optional(),
});

export type Notice = z.infer<typeof NoticeSchema>;

export const contentRouter = router({
  notice: rateLimitedProcedure.query(async () => {
    const rawNotice = await sanityClient.fetch(
      groq`*[_type == "regattaSettings"][0].note`,
    );

    const notice = NoticeSchema.safeParse(rawNotice);

    if (!notice.success) {
      throw new Error("Server error: invalid notice");
    }

    return notice.data;
  }),

  feed: rateLimitedProcedure.query(fetchBritishRowingFeed),
  pg: rateLimitedProcedure.query(getWodehouseFullDetails),
});
