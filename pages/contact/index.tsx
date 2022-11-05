import ContactForm from "@/components/contact";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import HeroTitle from "@/components/stour/hero/hero-title";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";
import type { Officer } from "@/types/governance";
import { Obfuscate } from "@south-paw/react-obfuscate-ts";
import groq from "groq";
import type { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import type { Message } from "@/components/contact/contactForm";
import { InferGetStaticPropsType } from "next";

export const getStaticProps: GetStaticProps = async () => {
  const officers: Officer[] = await sanityClient.fetch(
    groq`
      *[_type == "officers" && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""] | order(orderRank){
        _id,
        name,
        role
      }`
  );
  return {
    props: {
      officers,
    },
  };
};

const Contact: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  officers,
}) => {
  const router = useRouter();
  const initialValues = router.query as Message;
  return (
    <Layout>
      <NextSeo
        description="Get in touch"
        openGraph={{
          description: "Get in touch",
          images: [{ url: `${BASE_URL}/assets/og/contact.png` }],
          title: "Contact Sudbury Rowing Club",
        }}
        title="Contact Sudbury Rowing Club"
      />
      <HeroTitle prose title="Contact a club officer" />
      <Container className="max-w-lg py-12">
        <div className="pb-10 mx-auto prose">
          <p>
            We’re a volunteer-run club that provides a safe and fun way to row,
            but we also need your help. Since we don’t have a full-time staff to
            respond to enquiries, we ask that you select an appropriate
            recipient for your enquiry.
          </p>
        </div>
        <ContactForm contacts={officers} initialValues={initialValues} />
        <div className="mt-16 text-sm prose text-gray-500">
          Alternatively, mail{" "}
          <Obfuscate email="enquiries@sudburyrowingclub.org.uk" /> for general
          enquiries, or <Obfuscate email="regatta@sudburyrowingclub.org.uk" />{" "}
          for regatta-related enquiries.
        </div>
      </Container>
    </Layout>
  );
};

export default Contact;
