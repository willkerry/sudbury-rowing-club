import Bowser from "bowser";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { env } from "@/env";
import { checkForSpam } from "@/lib/akismet";
import { SENDER } from "@/lib/constants";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { BugReportSchema } from "./BugReportSchema";

const resend = new Resend(env.RESEND_API_KEY);

const parseToJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const POST = async (req: NextRequest) => {
  const maybeRateLimitedResponse = await routeHandlerRatelimiter(req);
  if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

  if (!env.BUG_RECIPIENT_EMAIL) {
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
    replyTo: `${name} <${email}>`,
    to: env.BUG_RECIPIENT_EMAIL,
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
