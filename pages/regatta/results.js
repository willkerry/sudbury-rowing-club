import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import rawData from "@/data/regatta";
import Results from "@/components/regatta/results";

export const getStaticProps = async () => {
  return {
    props: {
      data: rawData,
    },
    revalidate: 60,
  };
};Œ

export default function ResultsPage({ data }) {
  return (
    <Layout>
      <Head>
        <title>Sudbury Rowing Club Regatta Results</title>
      </Head>
      <HeroTitle title="Regatta results" breadcrumbs />
      <Container className="py-16">
        <Results data={data} />
      </Container>
    </Layout>
  );
}
