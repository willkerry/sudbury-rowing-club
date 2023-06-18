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

class ResponseError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

const validateRequest = (req: NextApiRequest) => {
  try {
    const request = RequestSchema.parse(req.body);

    return {
      fromEmail: request.email,
      fromName: request.name,
      toID: request.to,
      message: request.message,
    };
  } catch (error) {
    console.error(error);

    throw new ResponseError(JSON.stringify(error), 400);
  }
};

const spamCheck = async (
  req: NextApiRequest,
  name: string,
  email: string,
  message: string
) => {
  const isSpam = await checkForSpam(
    req.headers["x-forwarded-for"]?.toString() || "",
    req.headers["user-agent"] || "",
    req.headers.referer || "",
    name,
    email,
    message
  ).catch(() => {
    throw new ResponseError("Could not connect to Akismet", 500);
  });

  if (isSpam) throw new ResponseError("Message rejected as spam", 400);
};

const findRecipient = async (id: string) => {
  try {
    return await getOfficer(id);
  } catch (error) {
    console.error(error);

    throw new ResponseError("No recipient found", 500);
  }
};

export default async function Send(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      throw new ResponseError("Method not allowed", 405);
    }

    const { fromEmail, fromName, toID, message } = validateRequest(req);

    await spamCheck(req, fromName, fromEmail, message);

    const {
      name: toName,
      email: toEmail,
      role: toRole,
    } = await findRecipient(toID);

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
        throw new ResponseError(error.message, 500);
      })
      .then(() => {
        res.status(200).json("Message sent");
      });
  } catch (error: any) {
    res.status(error.status || 500).json(error.message);
  }
}
