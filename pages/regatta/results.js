import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import data from "@/data/regatta";
import ordinal from "ordinal";
import Link from "next/link";
import { ExternalLink } from "react-feather";
import DateFormatter from "@/components/date-formatter";

export default function Photography({ preview }) {
  const resultsData = data.results.results;
  const courseRecords = data.results.courseRecords;
  return (
    <Layout preview={preview}>
      <Head>
        <title>Sudbury Rowing Club Regatta Results</title>
      </Head>
      <HeroTitle title="Regatta results" breadcrumbs />
      <Container>
        <div className="py-16 prose prose-lg max-w-none">
          <table>
            <thead>
              <th></th>
              <th>Date</th>
              <th>Fastest 350m</th>
              <th>Fastest 650m</th>
              <th>Results</th>
            </thead>
            <tbody>
              {resultsData.map(
                ({
                  link,
                  year,
                  date,
                  fastest,
                  eightsFastest,
                  number,
                  index,
                }) => (
                  <tr className="hover:bg-gray-50">
                    <td>
                      <span className="font-semibold">
                        {ordinal(number)} Sudbury Regatta
                      </span>
                    </td>
                    <td>
                      <span className="tabular-nums">
                        <DateFormatter dateString={date} />
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-pink-500 tabular-nums ">
                        {eightsFastest}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold text-pink-500 tabular-nums ">
                        {fastest}
                      </span>
                    </td>
                    <td>
                      {link ? (
                        <Link href={link} passHref>
                          <a
                            className="inline-block pr-4 last-of-type:pr-0"
                            title={"View the " + year + " regatta results."}
                          >
                            View results
                            <ExternalLink
                              size={12}
                              className="inline mb-1 ml-1"
                            />
                          </a>
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </Layout>
  );
}
