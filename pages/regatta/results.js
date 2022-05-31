import groq from "groq";
import PropTypes from "prop-types";
import { NextSeo } from "next-seo";
import { BASE_URL } from "@/lib/constants";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Results from "@/components/regatta/results";
import Text from "@/components/stour/text";
import sanityClient from "@/lib/sanity.server";

export default function ResultsPage({ data, other }) {
  return (
    <Layout>
      <NextSeo
        title="Regatta Results | Sudbury Rowing Club"
        openGraph={{
          title: "Regatta Results",
          images: [{ url: `${BASE_URL}/assets/og/results.png` }],
        }}
      />
      <HeroTitle title="Regatta results" breadcrumbs />
      <Container className="py-16">
        <Results results={data} records={other.records}>
          <Text lead portableText={other.description} />
        </Results>
      </Container>
    </Layout>
  );
}
ResultsPage.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      results: PropTypes.string,
    })
  ).isRequired,
  other: PropTypes.shape({
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.node,
    ]),
    records: PropTypes.string,
  }).isRequired,
};

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`
      {
        "results": *[_type == "regattas" && results != "" && !(_id in path("drafts.**"))] | order(date desc) {
          _id,
          date, 
          results,
          number
        },
        "other": *[_type == "regattaSettings"][0] {
          "description": results.description,
          "records": results.courseRecords.asset->url
	      }   
      } 
    `
  );
  return {
    props: {
      data: data.results,
      other: data.other,
    },
  };
};
