/* eslint-disable camelcase */
/* eslint-disable no-console */
import snarkdown from "snarkdown";
import sendMail from "@/lib/sendMail";
import checkForSpam from "@/lib/akismet";
import getOfficer from "@/lib/get-officer";
import DOMPurify from "isomorphic-dompurify";

const footerText: string = "Sent via the contact form on the Sudbury Rowing Club website. If you believe you’ve received this message in error, or are receiving excessive spam, please contact will@willkerry.com.";

export default async function Send(req: any, res: any): Promise<void> {
  try {
    const { email, name, to, message } = req.body;
    if (!email || !name || !to || !message) {
      throw new Error("Missing required fields");
    }
    const isSpam = await checkForSpam(req.ip, req.headers["user-agent"], req.headers.referer, name, email, message);
    if (isSpam) {
      throw new Error("Message rejected as spam.");
    }

    const addressee = await getOfficer(to);
    if (!addressee) {
      throw new Error("No officer found with that ID");
    }
    const cleanMessage = DOMPurify.sanitize(message);

    const mailSubject = `${name} via SRC Contact`
    const mailFrom = { email: "noreply@sudburyrowingclub.org.uk", name }
    const mailReplyTo = { email, name }
    const mailTo = [{ name: addressee.name, email: addressee.email }]
    const mailContent = `<html><body>${snarkdown(cleanMessage)}<hr/><small><p>${footerText}</p></small></body></html>`

    const mail = await sendMail(
      mailSubject,
      mailFrom,
      mailReplyTo,
      mailTo,
      mailContent
    );

    console.log("mail", mail);

    if (mail !== "success") {
      throw new Error("Could not connect to mail API");
    }

    res.status(200).json({
      status: "success",
      message: "Message sent",
    });

  }
  catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
;
