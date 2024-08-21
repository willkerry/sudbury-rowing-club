import { ZTypedObject, sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { NextResponse } from "next/server";
import { z } from "zod";

export const revalidate = 5 * 60;

const NoticeSchema = z.object({
  display: z.boolean(),
  label: z.string(),
  text: z.array(ZTypedObject).optional(),
  type: z.enum(["primary", "secondary", "success", "warning", "error"]),
  link: z.string().optional(),
  date: z
    .string()
    .optional()
    .refine((s) => !s || !Number.isNaN(Date.parse(s))),
});

export type Notice = z.infer<typeof NoticeSchema>;

export const GET = async () => {
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
