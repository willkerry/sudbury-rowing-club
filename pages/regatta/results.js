import { BASE_URL } from "@/lib/constants";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import rawData from "@/data/regatta";
import Results from "@/components/regatta/results";
import { NextSeo } from "next-seo";

export const getStaticProps = async () => {
  return {
    props: {
      data: rawData,
    },
    revalidate: 60,
  };
};

export default function ResultsPage({ data }) {
  return (
    <Layout>
      <NextSeo
        title="Regatta Results | Sudbury Rowing Club"
        openGraph={{
          title: "Regatta Results",
          images: [{ url: BASE_URL + "/assets/og/results.png" }],
        }}
      />
      <HeroTitle title="Regatta results" breadcrumbs />
      <Container className="py-16">
        <Results data={data} />
      </Container>
    </Layout>
  );
}
