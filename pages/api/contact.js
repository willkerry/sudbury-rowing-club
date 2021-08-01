import nodemailer from "nodemailer";
import { getOfficerByHash } from "../../lib/officer-contacts";

const emailPass = "yourPassword";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "sedrick.zulauf@ethereal.email",
    pass: "S925WfAzZSFK1uuAzS",
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
  const from =
    name && senderMail ? `${name} <${senderMail}>` : `${name || senderMail}`;
  const to = `${getOfficerByHash(recipientMail)}`;
  const message = {
    from,
    to: to,
    subject: `New message from ${from}`,
    text,
    replyTo: from,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) =>
      error ? reject(error) : resolve(info)
    );
  });
};
