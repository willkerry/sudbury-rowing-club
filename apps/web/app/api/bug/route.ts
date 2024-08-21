import checkForSpam from "@/lib/akismet";
import { SENDER } from "@/lib/constants";
import Bowser from "bowser";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const parseToJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const BugReportSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  description: z.string().min(1),
  userAgent: z.string().min(1),
  additionalInformation: z.string().optional(),
});

export type BugReport = z.infer<typeof BugReportSchema>;

export const POST = async (req: NextRequest) => {
  if (!process.env.BUG_RECIPIENT_EMAIL) {
    return new NextResponse("BUG_RECIPIENT_EMAIL not set.", {
      status: 500,
    });
  }

  const body = BugReportSchema.safeParse(await req.json());

  if (!body.success) {
    console.log("Invalid body", body.error.issues);

    return new NextResponse("Invalid body", {
      status: 400,
    });
  }

  const { name, email, description, userAgent, additionalInformation } =
    body.data;
  console.log("Bug report", { name, email, description, userAgent });

  const isSpam = await checkForSpam(
    req.headers.get("x-forwarded-for") ?? "",
    req.headers.get("user-agent") ?? "",
    req.headers.get("referer") ?? "",
    name,
    email,
    description,
  );

  if (isSpam) {
    console.log("Spam detected", { name, email, description });
    return new NextResponse("The spam filter has blocked this request.", {
      status: 403,
    });
  }

  const response = await resend.emails.send({
    from: `${name} <${SENDER.email}>`,
    reply_to: `${name} <${email}>`,
    to: process.env.BUG_RECIPIENT_EMAIL,
    subject: "Bug Report from sudburyrowingclub.org.uk",
    text: `DESCRIPTION: ${description}\n\nREPORTER: ${name} <${
      SENDER.email
    }>\n\nDATA: ${JSON.stringify(
      {
        description,
        userAgent,
        parsedUserAgent: Bowser.parse(userAgent),
        additionalInformation: parseToJSON(additionalInformation ?? ""),
      },
      null,
      2,
    )}`,
  });

  if (response.error) {
    console.error("Failed to send bug report", response.error);

    return new NextResponse(
      `Failed to send bug report: ${response.error.message}`,
      {
        status: 500,
      },
    );
  }

  return new NextResponse("Bug report sent successfully.", {
    status: 200,
  });
};
