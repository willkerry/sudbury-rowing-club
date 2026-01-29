import { ContactFormEmail } from "emails/contact-form";
import DOMPurify from "isomorphic-dompurify";
import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { MessageSchema } from "@/components/contact/Message";
import { env } from "@/env";
import { checkForSpam } from "@/lib/akismet";
import { SENDER } from "@/lib/constants";
import { getOfficer } from "@/lib/get-officer";
import { routeHandlerRatelimiter } from "@/lib/rate-limiter";
import { trackServerEvent, trackServerException } from "@/lib/server/track";
import { parseWithFieldErrors, ValidationError } from "@/lib/validation";

const resend = new Resend(env.RESEND_API_KEY);

const formatName = (email: string, name: string) => {
  if (name) return `${name} <${email}>`;

  return email;
};

class ResponseError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const validateRequest = async (req: NextRequest) => {
  const request = parseWithFieldErrors(MessageSchema, await req.json());

  return {
    fromEmail: request.email,
    fromName: request.name,
    toID: request.to,
    message: request.message,
  };
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
  ).catch((error) => {
    trackServerEvent("contact_form_external_api_failure", {
      service: "akismet",
      error_message: error instanceof Error ? error.message : String(error),
    });

    throw new ResponseError("Could not connect to spam checking service.", 500);
  });

  if (isSpam)
    throw new ResponseError(
      "Your message has been flagged as spam. Please contact us directly.",
      403,
    );
};

const findRecipient = async (id: string) => {
  try {
    return await getOfficer(id);
  } catch {
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

    const createEmailResponse = await resend.emails.send({
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
      text: DOMPurify.sanitize(message),
    });

    if (createEmailResponse.error) {
      trackServerEvent("contact_form_external_api_failure", {
        service: "resend",
        error_message: createEmailResponse.error.message,
        error_name: createEmailResponse.error.name,
      });

      throw new ResponseError(
        `A third party service returned an error: ${createEmailResponse.error.message}`,
        502,
      );
    }

    if (createEmailResponse.data.id) {
      return new NextResponse(`Message ID: ${createEmailResponse.data.id}`, {
        status: 200,
        statusText: `Message ID: ${createEmailResponse.data.id}`,
      });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(error.errors, { status: 400 });
    }

    if (error instanceof ResponseError) {
      return new NextResponse(error.message, {
        status: error.status || 500,
        statusText: error.message,
      });
    }

    trackServerException(error);

    return new NextResponse("Unhandled exception", {
      status: 500,
      statusText: `Unhandled exception: ${error instanceof Error ? error.message : error}`,
    });
  }
};
