import { TRPCError } from "@trpc/server";
import Bowser from "bowser";
import { ContactFormEmail } from "emails/contact-form";
import DOMPurify from "isomorphic-dompurify";
import { tryit } from "radashi";
import { Resend } from "resend";
import { BugReportSchema } from "@/app/bugs/BugReportSchema";
import { MessageSchema } from "@/components/contact/Message";
import { env } from "@/env";
import { checkHeadersForSpam } from "@/lib/akismet";
import { SENDER } from "@/lib/constants";
import { getOfficer } from "@/lib/get-officer";
import { storeInflightContact } from "@/lib/inflight-contact";
import { trackServerEvent } from "@/lib/server/track";
// import { checkHeadersForTurnstileToken } from "@/lib/turnstile";
import { rateLimitedProcedure, router } from "../init";

const resend = new Resend(env.RESEND_API_KEY);

const formatName = (email: string, name: string) => {
  if (name) return `${name} <${email}>`;

  return email;
};

const parseToJSON = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const commsRouter = router({
  bug: rateLimitedProcedure
    .input(BugReportSchema)
    .mutation(async ({ input, ctx }) => {
      if (!env.BUG_RECIPIENT_EMAIL) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "BUG_RECIPIENT_EMAIL not set.",
        });
      }

      const [spamError, isSpam] = await tryit(checkHeadersForSpam)(
        ctx.headers,
        {
          ...input,
          message: input.description,
        },
      );

      if (spamError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not connect to spam checking service.",
        });
      }

      if (isSpam) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "The spam filter has blocked this request.",
        });
      }

      const response = await resend.emails.send({
        from: `${input.name} <${SENDER.email}>`,
        replyTo: `${input.name} <${input.email}>`,
        subject: "Bug Report from sudburyrowingclub.org.uk",
        text: `DESCRIPTION: ${input.description}\n\nREPORTER: ${input.name} <${SENDER.email}>\n\nDATA: ${JSON.stringify(
          {
            additionalInformation: parseToJSON(
              input.additionalInformation ?? "",
            ),
            description: input.description,
            parsedUserAgent: Bowser.parse(input.userAgent),
            userAgent: input.userAgent,
          },
          null,
          2,
        )}`,
        to: env.BUG_RECIPIENT_EMAIL,
      });

      if (response.error) {
        trackServerEvent("bug_report_external_api_failure", {
          error_message: response.error.message,
          error_name: response.error.name,
          service: "resend",
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to send bug report: ${response.error.message}`,
        });
      }

      return { success: true };
    }),
  send: rateLimitedProcedure
    .input(MessageSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Re-enable Turnstile verification
      // const [turnstileError, turnstileResponse] = await tryit(
      //   checkHeadersForTurnstileToken,
      // )(ctx.headers, { token: input.token });
      //
      // if (turnstileError) {
      //   throw new TRPCError({
      //     cause: turnstileError.message,
      //     code: "INTERNAL_SERVER_ERROR",
      //     message: "Could not connect to verification service.",
      //   });
      // }
      //
      // if (!turnstileResponse.success) {
      //   throw new TRPCError({
      //     cause: turnstileResponse.messages?.join(", "),
      //     code: "FORBIDDEN",
      //     message: "The verification service has blocked this request.",
      //   });
      // }

      const [spamError, isSpam] = await tryit(checkHeadersForSpam)(
        ctx.headers,
        input,
      );

      if (spamError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not connect to spam checking service.",
        });
      }

      if (isSpam) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Your message has been flagged as spam. Please contact us directly.",
        });
      }

      const [officerError, officer] = await tryit(getOfficer)(input.to);

      if (officerError) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: officerError.message,
        });
      }

      const { name: toName, email: toEmail, role: toRole } = officer;
      const sanitizedMessage = DOMPurify.sanitize(input.message);

      const createEmailResponse = await resend.emails.send({
        from: formatName(SENDER.email, SENDER.name),
        react: ContactFormEmail({
          toName,
          toEmail,
          toRole,
          fromEmail: input.email,
          fromName: input.name,
          message: sanitizedMessage,
        }),
        replyTo: formatName(input.email, input.name),
        subject: `${input.name} via SRC Contact`,
        text: sanitizedMessage,
        to: formatName(toEmail, toName),
      });

      if (createEmailResponse.error) {
        trackServerEvent("contact_form_external_api_failure", {
          error_message: createEmailResponse.error.message,
          error_name: createEmailResponse.error.name,
          service: "resend",
        });

        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: `A third party service returned an error: ${createEmailResponse.error.message}`,
        });
      }

      const messageId = createEmailResponse.data?.id ?? null;

      if (messageId) {
        const [storeError] = await tryit(storeInflightContact)(messageId, {
          fromEmail: input.email,
          fromName: input.name,
          message: sanitizedMessage,
          toName,
          toRole,
        });

        if (storeError) {
          trackServerEvent("contact_form_inflight_store_failure", {
            error_message: storeError.message,
            error_name: storeError.name,
          });
        }
      }

      return {
        messageId,
      };
    }),
});
