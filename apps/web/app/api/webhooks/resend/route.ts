import { ContactFormDeliveredEmail } from "emails/contact-form-delivered";
import { ContactFormFailedEmail } from "emails/contact-form-failed";
import { type NextRequest, NextResponse } from "next/server";
import { tryit } from "radashi";
import { Resend } from "resend";
import { z } from "zod";
import { env } from "@/env";
import { EMAIL, SENDER } from "@/lib/constants";
import {
  deleteInflightContact,
  type InflightContact,
  readInflightContact,
} from "@/lib/inflight-contact";
import { trackServerEvent } from "@/lib/server/track";

const ResendEventSchema = z.object({
  data: z.object({
    email_id: z.string().optional(),
  }),
  type: z.string(),
});

const resend = new Resend(env.RESEND_API_KEY);

const formatName = (email: string, name: string) => {
  if (name) return `${name} <${email}>`;

  return email;
};

const DELIVERED_EVENTS = new Set(["email.delivered"]);
const FAILED_EVENTS = new Set([
  "email.bounced",
  "email.complained",
  "email.failed",
  "email.canceled",
]);

const sendDeliveredNotification = async (
  contact: InflightContact,
): Promise<{ error?: string }> => {
  const { data, error } = await resend.emails.send({
    from: formatName(SENDER.email, SENDER.name),
    react: ContactFormDeliveredEmail({
      fromName: contact.fromName,
      toName: contact.toName,
      toRole: contact.toRole,
    }),
    subject: `We’ve delivered your message to ${contact.toRole}`,
    text: `We’ve delivered your message to ${contact.toName} (${contact.toRole}). They’ll reply to you directly.`,
    to: formatName(contact.fromEmail, contact.fromName),
  });

  if (error) return { error: error.message };
  if (!data?.id) return { error: "No message ID returned" };

  return {};
};

const sendFailedNotification = async (
  contact: InflightContact,
): Promise<{ error?: string }> => {
  const { data, error } = await resend.emails.send({
    from: formatName(SENDER.email, SENDER.name),
    react: ContactFormFailedEmail({
      fallbackEmail: EMAIL,
      fromName: contact.fromName,
      toRole: contact.toRole,
    }),
    subject: "We couldn’t deliver your message to Sudbury Rowing Club",
    text: `We couldn’t deliver your message to the ${contact.toRole}. Please email ${EMAIL} directly and someone will pass it on.`,
    to: formatName(contact.fromEmail, contact.fromName),
  });

  if (error) return { error: error.message };
  if (!data?.id) return { error: "No message ID returned" };

  return {};
};

export async function POST(req: NextRequest) {
  const payload = await req.text();

  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");

  if (!(id && timestamp && signature)) {
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  const [verifyError, verified] = await tryit(async () =>
    resend.webhooks.verify({
      headers: { id, signature, timestamp },
      payload,
      webhookSecret: env.RESEND_WEBHOOK_SECRET,
    }),
  )();

  if (verifyError || !verified) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const parsed = ResendEventSchema.safeParse(verified);

  if (!parsed.success) {
    return NextResponse.json({ ignored: "unparseable" }, { status: 200 });
  }

  const { type: eventType, data } = parsed.data;
  const emailId = data.email_id;

  if (!emailId) {
    return NextResponse.json({ ignored: "no email_id" }, { status: 200 });
  }

  const isDelivered = DELIVERED_EVENTS.has(eventType);
  const isFailed = FAILED_EVENTS.has(eventType);

  if (!(isDelivered || isFailed)) {
    return NextResponse.json({ ignored: eventType }, { status: 200 });
  }

  const contact = await readInflightContact(emailId);

  if (!contact) {
    return NextResponse.json({ ignored: "not tracked" }, { status: 200 });
  }

  const { error: sendError } = isDelivered
    ? await sendDeliveredNotification(contact)
    : await sendFailedNotification(contact);

  if (sendError) {
    trackServerEvent("contact_form_status_notification_failure", {
      error_message: sendError,
      event_type: eventType,
      service: "resend",
    });

    return new NextResponse("Notification send failed", { status: 500 });
  }

  await deleteInflightContact(emailId);

  return NextResponse.json({ handled: eventType }, { status: 200 });
}
