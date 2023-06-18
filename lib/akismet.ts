import url from "url";
import axios from "axios";

export default async function checkForSpam(
  userIp: string,
  userAgent: string,
  referrer: string,
  commentAuthor: string,
  commentAuthorEmail: string,
  commentContent: string
): Promise<boolean> {
  const isSpam = await axios.post(
    "https://6c80e09f5c4d.rest.akismet.com/1.1/comment-check",
    new url.URLSearchParams({
      blog: "https://sudburyrowingclub.org.uk/",
      user_ip: userIp,
      user_agent: userAgent,
      referrer,
      comment_type: "contact-form",
      comment_author: commentAuthor,
      comment_author_email: commentAuthorEmail,
      comment_content: commentContent,
      blog_lang: "en_gb",
    })
  );

  return isSpam.data;
}
