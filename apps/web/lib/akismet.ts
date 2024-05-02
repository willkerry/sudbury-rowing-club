import { BASE_URL } from "./constants";

const API_KEY = "6c80e09f5c4d";

export default async function checkForSpam(
  userIp: string,
  userAgent: string,
  referrer: string,
  commentAuthor: string,
  commentAuthorEmail: string,
  commentContent: string,
): Promise<boolean> {
  const body = new URLSearchParams({
    api_key: API_KEY,
    blog: BASE_URL,
    user_ip: userIp,
    user_agent: userAgent,
    referrer,
    comment_type: "contact-form",
    comment_author: commentAuthor,
    comment_author_email: commentAuthorEmail,
    comment_content: commentContent,
    blog_lang: "en_gb",
  });

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
  });

  const isSpam = await fetch("https://rest.akismet.com/1.1/comment-check", {
    method: "POST",
    headers,
    body,
  }).then((res) => res.text());

  return isSpam === "true";
}
