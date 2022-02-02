import groq from "groq";
import PropTypes from "prop-types";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import ContactForm from "@/components/contact";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";

export const getStaticProps = async () => {
  const officers = await sanityClient.fetch(
    groq`
      *[_type == "officers" && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""] | order(order asc){
        _id,
        name,
        role
      }
    `
  );

  return {
    props: {
      officers,
    },
  };
};

export default function Contact({ officers }) {
  const router = useRouter();
  const initialValues = router.query;
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
        <ContactForm contacts={officers} initialValues={initialValues} />
      </Container>
    </Layout>
  );
}

Contact.propTypes = {
  officers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// export const getStaticProps = async () => {
//   const data = await sanityClient.fetch(
//     groq`
//       *[_type == "officers" && !(_id in path("drafts.**")) && vacant == false && email != null && email != ""] | order(order asc){
//         _id,
//         name,
//         role
//       }
//     `
//   );
//   return {
//     props: { officers: data },
//   };
// };
