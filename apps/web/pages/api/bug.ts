import checkForSpam from "@/lib/akismet";
import { SENDER } from "@/lib/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type BugReport = {
  name: string;
  email: string;
  description: string;
  userAgent: string;
  additionalInformation?: string;
};

export default async function ReportBug(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, email, description, userAgent, additionalInformation } =
    req.body as BugReport;
  console.log("Bug report", { name, email, description, userAgent });

  if (!name || !email || !description) {
    console.log("Missing required fields", { name, email, description });
    res.status(400).send("Missing required fields.");
    return;
  }

  const isSpam = await checkForSpam(
    req.headers["x-forwarded-for"]?.toString() || "",
    req.headers["user-agent"] || "",
    req.headers.referer || "",
    name,
    email,
    description,
  );

  if (isSpam) {
    console.log("Spam detected", { name, email, description });
    res.status(403).send("The spam filter has blocked this request.");
    return;
  }

  const response = await resend.emails.send({
    from: `${name} <${SENDER.email}>`,
    reply_to: `${name} <${email}>`,
    to: `Bug Report <${SENDER.email}>`,
    subject: "Bug Report from sudburyrowingclub.org.uk",
    text: `${description}\n\nUSER AGENT: ${
      req.headers["user-agent"] || userAgent || "Unable to get a UA."
    }\n\nADDITIONAL INFORMATION: ${additionalInformation || "None provided."}`,
  });

  if (response.error) {
    console.error("Failed to send bug report", response.error);
    res
      .status(500)
      .send(`Failed to send bug report: ${response.error.message}`);
    return;
  }

  res.status(200).send("Bug report sent successfully.");
}