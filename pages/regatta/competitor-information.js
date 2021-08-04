import Layout from "@/components/layout";
import HeroTitle from "@/components/hero-title";
import Container from "@/components/container";
import Head from "next/head";
import CompetitorInformation from "@/components/regatta/competitor-information";

export default function CompetitorInformationPage() {
  return (
    <Layout>
      <Head>
        <title>Sudbury Regatta Competitor Information</title>
      </Head>
      <HeroTitle title="Competitor Information" breadcrumbs />
      <Container className="py-16">
        <CompetitorInformation />
      </Container>
    </Layout>
  );
}
