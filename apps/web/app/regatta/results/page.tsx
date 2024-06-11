import type { PortableTextProps } from "@portabletext/react";
import groq from "groq";
import { sanityClient } from "@sudburyrc/api";
import { createMetaData } from "@/lib/create-metadata";
import Container from "@/components/layouts/container";
import Results from "@/components/regatta/results";
import HeroTitle from "@/components/stour/hero/hero-title";
import Text from "@/components/stour/text";

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

export const metadata = createMetaData({
  title: "Regatta Results | Sudbury Rowing Club",
  description: "Results from the Sudbury Regatta.",
  image: { title: "Regatta Results" },
});

const ResultsPage = async () => {
  const { results, other }: { results: Result[]; other: Other } =
    await sanityClient.fetch(
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
      }`,
    );

  return (
    <>
      <HeroTitle
        title="Regatta results"
        breadcrumbs
        color="transparent"
        prose
      />
      <Container className="max-w-prose py-16">
        <Results results={results} records={other.records}>
          <Text lead portableText={other.description} />
        </Results>
      </Container>
    </>
  );
};

export default ResultsPage;
