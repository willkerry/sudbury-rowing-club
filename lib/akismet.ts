import url from "url";
import axios from "axios";

export default async function checkForSpam(
  userIp: string,
  userAgent: string,
  referer: string,
  commentAuthor: string,
  commentAuthorEmail: string,
  commentContent: string
) {
  const query = new url.URLSearchParams({
    blog: "https://sudburyrowingclub.org.uk/",
    user_ip: userIp,
    user_agent: userAgent,
    referrer: referer,
    comment_type: "contact-form",
    comment_author: commentAuthor,
    comment_author_email: commentAuthorEmail,
    comment_content: commentContent,
    blog_lang: "en_gb",
  });

  const isSpam = await axios.post(
    "https://6c80e09f5c4d.rest.akismet.com/1.1/comment-check",
    query
  );

  return isSpam.data;
}
