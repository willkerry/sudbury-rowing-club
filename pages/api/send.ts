/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable prefer-arrow-callback */
import axios from "axios";
import sanityClient from "@/lib/sanity.server";
import groq from "groq";
import nodemailer from "nodemailer";
import url from "url";

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

// Query our Sanity database for the supplied officer ID, return the officer's email address
const getOfficer = async (id: string) => {
  if (!id) {
    return;
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
  const result: officer = {
    name: data[0].name,
    email: data[0].email,
  };
  return result;
};

// // Instantiate a new nodemailer transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// A debugging Ethereal mail transporter to use for development
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "obvkbaertz2uynel@ethereal.email",
    pass: "8UkJYM4YCZ2gK9wMPR",
  },
});

// Verify that the transporter is working
// TODO: log this.
transporter.verify(function (error,
  // success
) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});


// Send an email to the supplied email address
export default async function (req: any, res: any): Promise<void> {
  try {
    // Assign data supplied in the POST request body to variables
    const { from_mail, from_name, to, message } = req.body;
    // If any of the required fields are missing, return an error
    if (!from_mail || !from_name || !to || !message) {
      throw new Error("Missing required fields");
    }

    // Query Akismet to determine if the message is spam
    const query = new url.URLSearchParams({
      blog: "https://sudburyrowingclub.org.uk/",
      user_ip: req.ip,
      user_agent: req.headers["user-agent"],
      referrer: req.headers.referer,
      comment_type: "contact-form",
      comment_author: from_name,
      comment_author_email: from_mail,
      comment_content: message,
      blog_lang: "en_gb",

    });
    const isSpam = await axios.post(
      "https://6c80e09f5c4d.rest.akismet.com/1.1/comment-check",
      query
    );

    console.log(`Akismet response: ${isSpam.data}`);
    console.log(req);

    // // If the Akismet response is malformed, throw an error
    if (isSpam.data !== false && isSpam.data !== true)
      throw new Error("Akismet error");
    // If Akismet says the message is spam, throw an error
    if (isSpam.data === true)
      throw new Error("Message rejected as spam");

    // Get the officer's email address from the database
    const addressee = await getOfficer(to);
    // If the email is not found, throw an error
    if (!addressee)
      throw new Error("Officer not found");

    // Build the email
    const emailMessage = {
      from: `${from_name} <${from_mail}>`,
      to: `${addressee.name} <${addressee.email}>`,
      subject: `${from_name} via SRC Contact`,
      text: `${message}\n\n
Sent via the contact form on the Sudbury Rowing Club website. If you believe you’ve received this message in error, or are receiving excessive spam, please contact will@willkerry.com.\n
Did Akismet think this was spam? ${isSpam.data ? "Yes" : "No"}`,
    };

    // Send the email
    if (!isSpam.data) {
      transporter.sendMail(emailMessage, function (error) {
        if (error) {
          throw new Error(error);
        }
      });
    }

    // Return a success response to the client
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    // Catch any errors and return a failure response to the client
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
