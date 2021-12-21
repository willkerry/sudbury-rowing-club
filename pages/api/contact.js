import Promise from "react";
import nodemailer from "nodemailer";
import { getOfficerByHash } from "@/lib/officer-contacts";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const composeMail = async (req, res) => {
  const { senderMail, name, content, recipientMail } = req.body;
  if (
    senderMail === "" ||
    name === "" ||
    content === "" ||
    recipientMail === ""
  ) {
    res.status(403).send("");
    return;
  }

  const adminMessage =
    "Sent from a contact form on the Sudbury Rowing Club website.";
  const newLine = "\r\n\r\n";

  const mailerRes = await mailer({
    senderMail,
    name,
    text:
      content +
      newLine +
      "* * *" +
      newLine +
      "Sender: " +
      `${name} <${senderMail}>` +
      newLine +
      adminMessage,
    recipientMail,
  });
  res.send(mailerRes);
};

const mailer = ({ senderMail, name, text, recipientMail }) => {
  const replyTo =
    name && senderMail ? `${name} <${senderMail}>` : `${name || senderMail}`;
  const from = "Sudbury Rowing Club <noreply@sudburyrowingclub.org.uk>";
  const to = `${getOfficerByHash(recipientMail)}`;
  const message = {
    from,
    to,
    subject: `New message from ${name}`,
    text,
    replyTo,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) =>
      error ? reject(error) : resolve(info)
    );
  });
};

export default composeMail;
