import ky from "ky";
import { BASE_URL } from "./constants";

const API_KEY = "6c80e09f5c4d";

export const checkForSpam = async (
  userIp: string,
  userAgent: string,
  referrer: string,
  commentAuthor: string,
  commentAuthorEmail: string,
  commentContent: string,
): Promise<boolean> => {
  const response = await ky
    .post("https://rest.akismet.com/1.1/comment-check", {
      body: new URLSearchParams({
        api_key: API_KEY,
        blog: BASE_URL,
        blog_lang: "en_gb",
        comment_author: commentAuthor,
        comment_author_email: commentAuthorEmail,
        comment_content: commentContent,
        comment_type: "contact-form",
        referrer: referrer,
        user_agent: userAgent,
        user_ip: userIp,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .text();

  return response === "true";
};

export const checkHeadersForSpam = async (
  headers: Headers,
  { name, email, message }: { name: string; email: string; message: string },
) =>
  checkForSpam(
    headers.get("x-forwarded-for") ?? "",
    headers.get("user-agent") ?? "",
    headers.get("referer") ?? "",
    name,
    email,
    message,
  );
