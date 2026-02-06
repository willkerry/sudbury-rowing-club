import ky from "ky";
import { BASE_URL } from "./constants";

const API_KEY = "6c80e09f5c4d";

export const checkForSpam = (
  userIp: string,
  userAgent: string,
  referrer: string,
  commentAuthor: string,
  commentAuthorEmail: string,
  commentContent: string,
): Promise<boolean> => {
  const formData = new FormData();

  formData.append("api_key", API_KEY);
  formData.append("blog", BASE_URL);
  formData.append("user_ip", userIp);
  formData.append("user_agent", userAgent);
  formData.append("referrer", referrer);
  formData.append("comment_type", "contact-form");
  formData.append("comment_author", commentAuthor);
  formData.append("comment_author_email", commentAuthorEmail);
  formData.append("comment_content", commentContent);
  formData.append("blog_lang", "en_gb");

  return ky
    .post("https://rest.akismet.com/1.1/comment-check", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
    .text()
    .then((r) => r === "true");
};
