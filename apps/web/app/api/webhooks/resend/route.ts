import { ContactFormDeliveredEmail } from "emails/contact-form-delivered";
import { ContactFormFailedEmail } from "emails/contact-form-failed";
import { type NextRequest, NextResponse } from "next/server";
import { tryit } from "radashi";
import { Resend, type WebhookEvent } from "resend";
import { z } from "zod";
import { env } from "@/env";
import { EMAIL, SENDER } from "@/lib/constants";
import {
  claimInflightContact,
  type InflightContact,
  readInflightContact,
  storeInflightContact,
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

const DELIVERED_EVENTS = new Set<WebhookEvent>(["email.delivered"]);
const FAILED_EVENTS = new Set<WebhookEvent>([
  "email.bounced",
  "email.complained",
  "email.failed",
]);

const sendDeliveredNotification = async (
  contact: InflightContact,
): Promise<{ error?: string }> => {
  const { error } = await resend.emails.send({
    from: formatName(SENDER.email, SENDER.name),
    react: ContactFormDeliveredEmail({
      fromName: contact.fromName,
      message: contact.message,
      toName: contact.toName,
      toRole: contact.toRole,
    }),
    subject: `We’ve delivered your message to ${contact.toName}`,
    text: `We’ve delivered your message to ${contact.toName} (${contact.toRole}). They’ll reply to you directly.`,
    to: formatName(contact.fromEmail, contact.fromName),
  });

  if (error) return { error: error.message };

  return {};
};

const sendFailedNotification = async (
  contact: InflightContact,
): Promise<{ error?: string }> => {
  const { error } = await resend.emails.send({
    from: formatName(SENDER.email, SENDER.name),
    react: ContactFormFailedEmail({
      fallbackEmail: EMAIL,
      fromName: contact.fromName,
      message: contact.message,
      toRole: contact.toRole,
    }),
    subject: `We couldn’t deliver your message to ${contact.toName}`,
    text: `We couldn’t deliver your message to ${contact.toName}. Please email ${EMAIL} directly and someone will pass it on.`,
    to: formatName(contact.fromEmail, contact.fromName),
  });

  if (error) return { error: error.message };

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

  const isDelivered = DELIVERED_EVENTS.has(eventType as WebhookEvent);
  const isFailed = FAILED_EVENTS.has(eventType as WebhookEvent);

  if (!(isDelivered || isFailed)) {
    return NextResponse.json({ ignored: eventType }, { status: 200 });
  }

  const contact = await readInflightContact(emailId);

  if (!contact) {
    return NextResponse.json({ ignored: "not tracked" }, { status: 200 });
  }

  const claimed = await claimInflightContact(emailId);

  if (!claimed) {
    return NextResponse.json({ ignored: "already claimed" }, { status: 200 });
  }

  const { error: sendError } = isDelivered
    ? await sendDeliveredNotification(contact)
    : await sendFailedNotification(contact);

  if (sendError) {
    await tryit(storeInflightContact)(emailId, contact);

    trackServerEvent("contact_form_status_notification_failure", {
      error_message: sendError,
      event_type: eventType,
      service: "resend",
    });

    return new NextResponse("Notification send failed", { status: 500 });
  }

  return NextResponse.json({ handled: eventType }, { status: 200 });
}
