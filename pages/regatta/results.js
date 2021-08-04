import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import data from "@/data/regatta";
import ordinal from "ordinal";
import Link from "next/link";
import { ExternalLink } from "react-feather";
import DateFormatter from "@/components/date-formatter";
import Results from "@/components/regatta/results";

export default function ResultsPage() {
  const resultsData = data.results.results;
  const courseRecords = data.results.courseRecords;
  return (
    <Layout>
      <Head>
        <title>Sudbury Rowing Club Regatta Results</title>
      </Head>
      <HeroTitle title="Regatta results" breadcrumbs />
      <Container className="py-16">
        <Results />
      </Container>
    </Layout>
  );
}
