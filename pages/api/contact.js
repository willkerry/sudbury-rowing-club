import nodemailer from "nodemailer";
import { getOfficerByHash } from "../../lib/officer-contacts";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async (req, res) => {
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

  const mailerRes = await mailer({
    senderMail,
    name,
    text: content,
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
