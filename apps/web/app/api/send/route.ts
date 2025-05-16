import checkForSpam from "@/lib/akismet";
import { SENDER } from "@/lib/constants";
import getOfficer from "@/lib/get-officer";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { ContactFormEmail } from "emails/contact-form";
import DOMPurify from "isomorphic-dompurify";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const formatName = (email: string, name: string) => {
  if (name) return `${name} <${email}>`;

  return email;
};

const RequestSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  to: z.string(),
  message: z.string(),
});

class ResponseError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const validateRequest = async (req: NextRequest) => {
  try {
    const request = RequestSchema.parse(await req.json());

    console.log("Validating request", request);

    return {
      fromEmail: request.email,
      fromName: request.name,
      toID: request.to,
      message: request.message,
    };
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => issue.message);
      throw new ResponseError(errors.join(", "), 400);
    }

    throw error;
  }
};

const spamCheck = async (
  req: NextRequest,
  name: string,
  email: string,
  message: string,
) => {
  const isSpam = await checkForSpam(
    req.headers.get("x-forwarded-for") ?? "",
    req.headers.get("user-agent") ?? "",
    req.headers.get("referer") ?? "",
    name,
    email,
    message,
  ).catch(() => {
    console.error("Could not connect to Akismet");

    throw new ResponseError("Could not connect to spam checking service.", 500);
  });

  console.log("Spam check", isSpam);

  if (isSpam)
    throw new ResponseError(
      "Your message has been flagged as spam. Please contact us directly.",
      403,
    );
};

const findRecipient = async (id: string) => {
  try {
    return await getOfficer(id);
  } catch (_error) {
    throw new ResponseError(
      "Could not find recipient. This is likely a temporary error. Please try again later or contact us directly.",
      404,
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const maybeRateLimitedResponse = await routeHandlerRatelimiter(req);
    if (maybeRateLimitedResponse) return maybeRateLimitedResponse;

    const { fromEmail, fromName, toID, message } = await validateRequest(req);

    await spamCheck(req, fromName, fromEmail, message);

    const {
      name: toName,
      email: toEmail,
      role: toRole,
    } = await findRecipient(toID);

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: formatName(SENDER.email, SENDER.name),
        to: formatName(toEmail, toName),
        replyTo: formatName(fromEmail, fromName),
        subject: `${fromName} via SRC Contact`,
        react: ContactFormEmail({
          toName,
          toEmail,
          toRole,
          fromName,
          fromEmail,
          message: DOMPurify.sanitize(message),
        }),
      });

      return new NextResponse("Message sent", {
        status: 200,
      });
    } catch (error) {
      console.error("error sending email", error);

      if (error instanceof Error) {
        throw new ResponseError(
          `A third party service returned an error: ${error.message}`,
          502,
        );
      }

      throw error;
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      return new NextResponse(error.message, {
        status: error.status || 500,
        statusText: error.message,
      });
    }

    return new NextResponse("Unhandled exception", {
      status: 500,
      statusText: `Unhandled exception: ${error instanceof Error ? error.message : error}`,
    });
  }
};
