import groq from "groq";
import PropTypes from "prop-types";
import { NextSeo } from "next-seo";
import Layout from "@/components/layouts/layout";
import HeroTitle from "@/components/stour/hero/hero-title";
import Container from "@/components/layouts/container";
import EventsComponent from "@/components/regatta/events";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";

const og = {
  title: "Event Information",
  description: "Races at the Sudbury Regatta.",
};

export default function EventsPage({ data }) {
  return (
    <Layout>
      <NextSeo
        title={`${og.title} | Sudbury Regatta`}
        description={og.description}
        openGraph={{
          title: og.title,
          description: og.description,
          images: [{ url: `${BASE_URL}/assets/og/events.png` }],
        }}
      />
      <HeroTitle title={og.title} breadcrumbs prose />
      <Container className="my-12">
        <EventsComponent data={data} />
      </Container>
    </Layout>
  );
}
EventsPage.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _key: PropTypes.string.isRequired,
      course: PropTypes.string.isRequired,
      categories: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
      boatClasses: PropTypes.arrayOf(PropTypes.string).isRequired,
      prizes: PropTypes.string.isRequired,
    })
  ),
};
EventsPage.defaultProps = {
  data: [],
};

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`*[_type == "regattaSettings"][0]{events}`
  );
  return {
    props: { data: data.events.events },
  };
};
