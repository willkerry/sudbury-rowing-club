import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const revalidate = 300;

const NoticeSchema = z.object({
  display: z.boolean(),
  label: z.string(),
  text: z.unknown(),
  type: z.enum(["primary", "secondary", "success", "warning", "error"]),
  link: z.string().optional(),
  date: z
    .string()
    .optional()
    .refine((s) => !(s && Number.isNaN(Date.parse(s)))),
});

export type Notice = z.infer<typeof NoticeSchema>;

export const GET = async (req: NextRequest) => {
  const maybeRateLimitedResponse = await routeHandlerRatelimiter(req);
  if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

  const rawNotice = await sanityClient
    .fetch(groq`*[_type == "regattaSettings"][0].note`)
    .catch(
      () =>
        new NextResponse("Server error: failed to fetch notice", {
          status: 500,
        }),
    );

  const notice = NoticeSchema.safeParse(rawNotice);

  if (!notice.success) {
    return new NextResponse("Server error: invalid notice", {
      status: 500,
    });
  }

  return new NextResponse(JSON.stringify(notice.data));
};
