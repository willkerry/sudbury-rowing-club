import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Results from "@/components/regatta/results";
import HeroTitle from "@/components/stour/hero/hero-title";
import Text from "@/components/stour/text";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";
import type { PortableTextProps } from "@portabletext/react";
import groq from "groq";
import { InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";

export interface Result {
  _id: string;
  date: Date;
  number: number;
  results: string;
}
export interface Other {
  description: PortableTextProps["value"];
  records: string;
}

export const getStaticProps = async () => {
  const data: { results: Result[]; other: Other } = await sanityClient.fetch(
    groq`{ 
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
      }`
  );
  return {
    props: { results: data.results, other: data.other },
  };
};

export default function ResultsPage({
  results,
  other,
}: InferGetStaticPropsType<typeof getStaticProps>) {
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
        <Results results={results} records={other.records}>
          <Text lead portableText={other.description} />
        </Results>
      </Container>
    </Layout>
  );
}
