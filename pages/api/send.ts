import { Resend } from "resend";
import checkForSpam from "@/lib/akismet";
import getOfficer from "@/lib/get-officer";
import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";
import { ContactFormEmail } from "emails/contact-form";
import { SENDER } from "@/lib/constants";
import type { NextApiRequest, NextApiResponse } from "next";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export default async function Send(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
      status: "error",
    });
  }

  // Try to catch uncaught errors too
  try {
    let fromEmail: string;
    let fromName: string;
    let toID: string;

    let message: string;

    // Validate the request body using `zod`
    try {
      const request = RequestSchema.parse(req.body);
      fromEmail = request.email;
      fromName = request.name;
      toID = request.to;
      message = request.message;
    } catch (error) {
      return res.status(400).json({
        message: JSON.stringify(error),
        status: "error",
      });
    }

    // Check for spam
    if (
      await checkForSpam(
        req.headers["x-real-ip"]?.toString() || req.socket.remoteAddress || "",
        req.headers["user-agent"] || "",
        req.headers.referer || "",
        fromName,
        fromEmail,
        message
      )
    ) {
      return res.status(400).json({
        message: "Message rejected as spam.",
        status: "error",
      });
    }

    // Get the officer's email address
    const recipient = await getOfficer(toID).catch((error) => {
      console.error(error);

      return res.status(500).json({
        message: "Could not connect to database",
        raw: error,
        status: "error",
      });
    });

    // Fail if no officer found
    if (!recipient)
      return res.status(400).json({
        message: "No officer found with that ID",
        status: "error",
      });

    const { name: toName, email: toEmail, role: toRole } = recipient;

    resend.emails
      .send({
        from: formatName(SENDER.email, SENDER.name),
        to: formatName(toEmail, toName),
        reply_to: formatName(fromEmail, fromName),
        subject: `${fromName} via SRC Contact`,
        react: ContactFormEmail({
          toName,
          toEmail,
          toRole,
          fromName,
          fromEmail,
          message: DOMPurify.sanitize(message),
        }),
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          message: "Could not connect to email server",
          raw: error,
          status: "error",
        });
      });

    res.status(200).json({
      message: "Message sent",
      status: "success",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
}
