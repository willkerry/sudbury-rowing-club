/* eslint-disable camelcase */
/* eslint-disable no-console */
import sanityClient from "@/lib/sanity.server";
import groq from "groq";
// import SibApiV3Sdk from "sib-api-v3-sdk";
import snarkdown from "snarkdown";
// import axios from "axios";
// import url from "url";
import sendInBlue from "@/lib/sendInBlue";

// This API receives HTTP POST requests with the following structure:
// {
//   "from_mail": ""
//   "from_name": ""
//   "to": ""
//   "message": ""
// }
// the 'to' field is a club officer ID

type officer = {
  name: string;
  email: string;
};

const footerText: string = "Sent via the contact form on the Sudbury Rowing Club website. If you believe you’ve received this message in error, or are receiving excessive spam, please contact will@willkerry.com.";

// Query our Sanity database for the supplied officer ID, return the officer's email address
async function getOfficer(id: string) {
  if (!id) {
    throw new Error("No officer ID supplied");
  }
  const data = await sanityClient.fetch(
    groq`
        *[_id == $id && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""] | order(order asc){
          name,
          email
        }
      `,
    { id }
  );
  if (data.length === 0) {
    throw new Error("No officer found with that ID");
  }
  else if (data.length > 1) {
    throw new Error("Multiple officers found with that ID");
  }
  const result: officer = {
    name: data[0].name,
    email: data[0].email,
  };
  return result;
}


// async function checkForSpam(userIp: string, userAgent: string, referer: string, commentAuthor: string, commentAuthorEmail: string, commentContent: string) {
//   const query = new url.URLSearchParams({
//     blog: "https://sudburyrowingclub.org.uk/",
//     user_ip: userIp,
//     user_agent: userAgent,
//     referrer: referer,
//     comment_type: "contact-form",
//     comment_author: commentAuthor,
//     comment_author_email: commentAuthorEmail,
//     comment_content: commentContent,
//     blog_lang: "en_gb",
//   });
//   const isSpam = await axios.post(
//     "https://6c80e09f5c4d.rest.akismet.com/1.1/comment-check",
//     query
//   );
//   return isSpam.data;
// }

// Send an email to the supplied email address
/**
 * This API receives HTTP POST requests with the following structure:
 * {
 *  "from_mail": ""
 *  "from_name": ""
 *  "to": ""
 *  "message": ""
 * }
 * the 'to' field is a club officer ID
 * @param  {any} req
 * @param  {any} res
 * @returns Promise
 */
export default async function Send(req: any, res: any): Promise<void> {
  try {
    const { from_mail, from_name, to, message } = req.body;

    if (!from_mail || !from_name || !to || !message) {
      throw new Error("Missing required fields");
    }
    // const isSpam = await checkForSpam(req.ip, req.headers["user-agent"], req.headers.referer, from_name, from_mail, message);
    // if (isSpam) {
    //   throw new Error("Message rejected as spam.");
    // }

    const addressee = await getOfficer(to);
    if (!addressee) {
      throw new Error("No officer found with that ID");
    }


    const mailBody = {
      subject: `${from_name} via SRC Contact`,
      sender: { email: "noreply@sudburyrowingclub.org.uk", name: from_name },
      replyTo: { email: from_mail, name: from_name },
      to: [{ name: addressee.name, email: addressee.email }],
      htmlContent:
        `<html><body>${snarkdown(message)}<hr/><small><p>${footerText}</p></small></body></html>`,
    }
    const mail = await sendInBlue(mailBody);
    if (mail !== "success") {
      throw new Error(mail);
    }

    res.status(200).json({
      status: "success",
      message: "Message sent",
    });

  }
  catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
;
