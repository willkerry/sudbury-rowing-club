import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

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
