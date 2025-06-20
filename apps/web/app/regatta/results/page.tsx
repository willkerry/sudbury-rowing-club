import Container from "@/components/layouts/container";
import Results from "@/components/regatta/results";
import { PageHeader } from "@/components/stour/hero/page-header";
import Text from "@/components/stour/text";
import { createMetadata } from "@/lib/create-metadata";
import type { PortableTextProps } from "@portabletext/react";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";

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

export const metadata = createMetadata({
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
      <PageHeader title="Regatta results" breadcrumbs />
      <Container className="pb-16">
        <Results results={results} records={other.records}>
          <Text lead portableText={other.description} />
        </Results>
      </Container>
    </>
  );
};

export default ResultsPage;
