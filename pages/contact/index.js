import Head from "next/head";
import Container from "@/components/container";
import Layout from "@/components/layout";
import ContactForm from "@/components/contact-form";
import HeroTitle from "@/components/hero-title";
import Link from "next/link";

export default function Contact() {
  return (
    <Layout>
      <Head>
        <title>Contact Sudbury Rowing Club</title>
      </Head>
      <HeroTitle title="Contact a club officer" prose />
      <Container className="max-w-lg py-12">
        <div className="pb-10 mx-auto prose">
          We’re a volunteer-run club that provides a safe and fun way to row,
          but we also need your help. Since we don’t have a full-time staff to
          respond to enquiries, we ask that you select an appropriate recipient
          for your enquiry.
        </div>
        <ContactForm />
      </Container>
    </Layout>
  );
}
