import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendinblue = async (mail) => {
  try {
    await apiInstance.sendTransacEmail(mail);
    return "success";
  } catch (error) {
    return error;
  }
};
export default sendinblue;
