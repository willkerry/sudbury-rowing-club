import { sanityClient, ZTypedObject } from "@sudburyrc/api";
import { getWodehouseFullDetails } from "get-wodehouse-name";
import groq from "groq";
import { z } from "zod";
import { fetchBritishRowingFeed } from "@/lib/server/fetchBritishRowingFeed";
import { rateLimitedProcedure, router } from "../init";

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
  feed: rateLimitedProcedure.query(fetchBritishRowingFeed),
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
  pg: rateLimitedProcedure.query(getWodehouseFullDetails),
});
