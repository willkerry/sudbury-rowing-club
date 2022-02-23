/* eslint-disable camelcase */
/* eslint-disable no-console */
import snarkdown from "snarkdown";
import sendInBlue from "@/lib/sendInBlue";
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

    const mailBody = {
      subject: `${name} via SRC Contact`,
      sender: { email: "noreply@sudburyrowingclub.org.uk", name },
      replyTo: { email, name },
      to: [{ name: addressee.name, email: addressee.email }],
      htmlContent:
        `<html><body>${snarkdown(cleanMessage)}<hr/><small><p>${footerText}</p></small></body></html>`,
    }
    const mail = await sendInBlue(mailBody);
    if (mail !== "success") {
      throw new Error(mail);
    }

    res.status(200).json({
      status: "success",
      message: "Message sent",
    });

  }
  catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
;
