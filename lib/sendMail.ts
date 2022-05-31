const SibApiV3Sdk = require('sib-api-v3-typescript');

type NameEmail = { email: string, name: string }

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.SENDINBLUE_API_KEY ? process.env.SENDINBLUE_API_KEY : "");


let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

const sendMail = async (
  subject: string,
  sender: NameEmail,
  replyTo: NameEmail,
  to: NameEmail[],
  htmlContent: string
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
}
export default sendMail;
