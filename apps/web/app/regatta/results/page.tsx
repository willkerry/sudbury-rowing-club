import type { PortableTextProps } from "@portabletext/react";
import { fetchRegattaSettings, sanityClient } from "@sudburyrc/api";
import { ordinal } from "@sudburyrc/helpers";
import groq from "groq";
import { Download, Table2 } from "lucide-react";
import NextLink from "next/link";
import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Link } from "@/components/stour/link";
import { Text } from "@/components/stour/text";
import { Button } from "@/components/ui/button";
import { DateFormatter } from "@/components/utils/date-formatter";
import { createMetadata } from "@/lib/create-metadata";
import { LiveResultsButton } from "./live-results-button";

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
  description: "Results from the Sudbury Regatta.",
  image: { title: "Regatta Results" },
  title: "Regatta Results | Sudbury Rowing Club",
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

  const { date: regattaDateString } = await fetchRegattaSettings();
  const regattaDate = new Date(regattaDateString);

  return (
    <>
      <PageHeader breadcrumbs title="Regatta results" />
      <Container className="pb-16">
        <div className="mb-12 space-y-12">
          <Text lead portableText={other.description} />

          <div className="flex gap-2">
            <LiveResultsButton regattaDate={regattaDate} />

            <Button asChild icon={<Table2 />} variant="secondary">
              <NextLink href="/regatta/records">
                View interactive records
              </NextLink>
            </Button>

            {other.records && (
              <Button asChild icon={<Download />} variant="ghost">
                <a href={`${other.records}?dl=`}>Download course records</a>
              </Button>
            )}
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <table>
            <thead>
              <tr>
                <th>Regatta</th>
                <th>Date</th>
                <th>Results</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ results: resultsLink, date, number, _id }) => (
                <tr className="hover:bg-gray-50" key={_id}>
                  <td>
                    <span className="font-semibold">
                      {number
                        ? ordinal(number)
                        : new Date(date).toLocaleDateString("en-GB", {
                            year: "numeric",
                          })}
                      <span className="hidden lg:inline"> Sudbury Regatta</span>
                    </span>
                  </td>
                  <td>
                    <span className="tabular-nums">
                      <DateFormatter dateString={date} />
                    </span>
                  </td>

                  <td>
                    {resultsLink ? (
                      <Link
                        aria-label={`View results from the ${date} regatta.`}
                        external
                        href={resultsLink}
                      >
                        View<span className="hidden sm:inline"> results</span>
                      </Link>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
};

export default ResultsPage;
