import Head from "next/head";
import Container from "@/components/container";
import Layout from "@/components/layout";
import ContactForm from "@/components/contact-form";
import {
  getHashByOfficerMail,
  getOfficerByHash,
} from "../../lib/officer-contacts";

const fieldClasses =
  "block w-full mt-1 border-gray-200 rounded-md focus:border-blue-600 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition";

export default function Contact() {
  return (
    <Layout>
      <Head>
        <title>Contact Sudbury Rowing Club</title>
      </Head>
      <Container className="py-8">
        {getOfficerByHash("215b2f9aad28eddecc190a926f4b4560")}
        <p>93942e96f5acd83e2e047ad8fe03114d</p>
        {getHashByOfficerMail("test@email.com")}
      </Container>
      <Container className="py-8">
        <ContactForm />
      </Container>
    </Layout>
  );
}
