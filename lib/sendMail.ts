import { SENDER } from "./constants";
const SibApiV3Sdk = require("sib-api-v3-typescript");
// import SibApiV3Sdk from "sib-api-v3-typescript";

export type NameEmail = { email: string; name: string };

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.SENDINBLUE_API_KEY ? process.env.SENDINBLUE_API_KEY : ""
);

const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

const sendMail = async (
  subject: string,
  replyTo: NameEmail,
  to: NameEmail[],
  htmlContent: string,
  sender: NameEmail = SENDER
) => {
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = sender;
  sendSmtpEmail.to = to;
  sendSmtpEmail.replyTo = replyTo;
  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return "success";
  } catch (error) {
    return error;
  }
};
export default sendMail;
