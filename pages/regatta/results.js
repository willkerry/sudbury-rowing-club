import groq from "groq";
import { NextSeo } from "next-seo";
import { BASE_URL } from "@/lib/constants";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
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
          <Text portableText lead>
            {other.description}
          </Text>
        </Results>
      </Container>
    </Layout>
  );
}

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
    revalidate: 7200,
  };
};
