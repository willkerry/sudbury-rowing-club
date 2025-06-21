import Container from "@/components/layouts/container";
import Copy from "@/components/stour/copy";
import { PageHeader } from "@/components/stour/hero/page-header";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";
import { createMetadata } from "@/lib/create-metadata";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";

export const metadata = createMetadata({
  title: "Official Photography | Sudbury Regatta",
  description: "Professional photography from the Sudbury Regatta.",
  image: { title: "Official Photography" },
});

export interface Gallery {
  _key: string;
  name: string;
  password?: string;
  url: string;
}

export interface Regatta {
  _id: string;
  date: string;
  galleries: Gallery[];
}

const Photography = async () => {
  const regattas: Regatta[] = await sanityClient.fetch(
    groq`
      *[_type == "regattas" && galleries != null] | order(date desc) {
          _id,
          date, 
          galleries
      }`,
  );

  return (
    <>
      <PageHeader title="Official regatta photography" breadcrumbs />
      <Container>
        <div className="prose prose-lg max-w-none pb-16">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>
                  <span className="sm:hidden">Password</span>
                </th>
                <th>Providers</th>
              </tr>
            </thead>
            <tbody>
              {regattas.map(({ _id, date, galleries }) => (
                <tr key={_id}>
                  <th>
                    <DateFormatter dateString={date} format="year" />
                    <span className="hidden sm:inline"> Regatta</span>
                  </th>

                  <td className="align-middle!">
                    {galleries.map(({ _key, password }) => {
                      if (!password) return null;

                      return (
                        <span id={_key} key={_key}>
                          <span className="hidden select-none sm:inline">
                            Password:{" "}
                          </span>
                          <Copy value={password} />
                        </span>
                      );
                    })}
                  </td>

                  <td className="flex gap-6">
                    {galleries.map(({ url, name, _key }) => {
                      if (!url) return null;

                      return (
                        <Link key={_key} href={url} external>
                          {name}
                        </Link>
                      );
                    })}
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

export default Photography;
