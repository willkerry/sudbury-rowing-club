import Head from "next/head";
import Container from "@/components/container";
import Layout from "@/components/layout";
import ContactForm from "@/components/contact-form";

export default function Contact() {
  return (
    <Layout>
      <Head>
        <title>Contact Sudbury Rowing Club</title>
      </Head>

      <Container className="py-16">
        <ContactForm />
      </Container>
    </Layout>
  );
}
