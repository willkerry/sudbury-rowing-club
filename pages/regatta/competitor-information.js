import groq from "groq";
import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import CompetitorInformation from "@/components/regatta/competitor-information";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";

export default function CompetitorInformationPage({ data }) {
  return (
    <Layout>
      <NextSeo
        title="Competitor Information | Sudbury Regatta"
        description="Essential information for competitors at the Sudbury Regatta."
        openGraph={{
          title: "Competitor Information",
          description:
            "Essential information for competitors at the Sudbury Regatta.",
          images: [{ url: `${BASE_URL}/assets/og/competitor-information.png` }],
        }}
      />
      <HeroTitle title="Competitor Information" breadcrumbs />
      <Container className="py-16">
        <CompetitorInformation
          description={data.description}
          items={data.documents}
        />
      </Container>
    </Layout>
  );
}

CompetitorInformationPage.propTypes = {
  data: PropTypes.shape({
    description: PropTypes.string.isRequired,
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        extension: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
  }),
};

CompetitorInformationPage.defaultProps = {
  data: {},
};

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(groq`
  *[_type == "regattaSettings"][0]{
    competitorInformation 
      { 
      description, 
      documents[] 
        { 
        title, 
        "extension": asset->extension, 
        "url": asset->url, 
        "_id": asset->_id
        },
      },
    } 
  `);
  return {
    props: { data: data.competitorInformation },
    revalidate: 900,
  };
};
