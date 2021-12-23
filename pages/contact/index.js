import groq from "groq";
import { NextSeo } from "next-seo";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";

export default function Contact() {
  return (
    <Layout>
      <NextSeo
        title="Contact Sudbury Rowing Club"
        description="Get in touch"
        openGraph={{
          title: "Contact Sudbury Rowing Club",
          description: "Get in touch",
          images: [{ url: `${BASE_URL}/assets/og/contact.png` }],
        }}
      />
      <HeroTitle title="Contact a club officer" prose />
      <Container className="max-w-lg py-12">
        <div className="pb-10 mx-auto prose">
          We’re a volunteer-run club that provides a safe and fun way to row,
          but we also need your help. Since we don’t have a full-time staff to
          respond to enquiries, we ask that you select an appropriate recipient
          for your enquiry.
        </div>
        {/* <ContactForm contacts={contactableOfficers} /> */}
      </Container>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`
      *[_type == "officers" && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""] | order(order asc){
        _id,
        name,
        role
      }
    `
  );
  return {
    props: { contactableOfficers: [...data] },
  };
};
