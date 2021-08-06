import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import data from "@/data/galleries";
import Link from "next/link";
import { ExternalLink } from "react-feather";

export default function Photography({ preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Official photography from the Sudbury Regatta</title>
      </Head>
      <HeroTitle title="Official regatta photography" breadcrumbs />
      <Container>
        <div className="py-16 prose prose-lg max-w-none">
          <table>
            <thead>
              <th>Year</th>
              <th>
                <span className="sm:hidden">Password</span>
              </th>
              <th>Providers</th>
            </thead>
            <tbody>
              {data.map(({ year, password, provider, index }) => (
                <tr key={index}>
                  <th>
                    {year}
                    <span className="hidden sm:inline"> Regatta</span>
                  </th>
                  <td className="!align-middle">
                    {password && (
                      <>
                        <span className="hidden select-none sm:inline">
                          Password:{" "}
                        </span>
                        <code>{password}</code>
                      </>
                    )}
                  </td>
                  <td>
                    {provider.map(({ name, href }) => (
                      <Link key={index} href={href}>
                        <a className="inline-block pr-4 last-of-type:pr-0">
                          {name}
                          <ExternalLink
                            size={12}
                            className="inline mb-1 ml-1"
                          />
                        </a>
                      </Link>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Layout>
  );
}
