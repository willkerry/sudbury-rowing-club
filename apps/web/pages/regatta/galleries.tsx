import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import groq from "groq";
import { sanityClient } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Copy from "@/components/stour/copy";
import HeroTitle from "@/components/stour/hero/hero-title";
import Link from "@/components/stour/link";
import DateFormatter from "@/components/utils/date-formatter";

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

export const getStaticProps: GetStaticProps = async () => {
  const regattas: Regatta[] = await sanityClient.fetch(
    groq`
      *[_type == "regattas" && galleries != null] | order(date desc) {
          _id,
          date, 
          galleries
      }`,
  );
  return {
    props: { regattas },
  };
};

const Photography: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  regattas,
}) => (
  <Layout>
    <NextSeo
      title="Official Photography | Sudbury Regatta"
      description="Professional photography from the Sudbury Regatta."
      openGraph={{
        title: "Official Photography",
        description: "Professional photography from the Sudbury Regatta.",
        images: [{ url: makeShareImageURL("Official Photography", true) }],
      }}
    />
    <HeroTitle title="Official regatta photography" breadcrumbs />
    <Container>
      <div className="prose prose-lg max-w-none py-16">
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
            {regattas.map((regatta: Regatta) => (
              <tr key={regatta._id}>
                <th>
                  <DateFormatter dateString={regatta.date} format="year" />
                  <span className="hidden sm:inline"> Regatta</span>
                </th>
                <td className="!align-middle">
                  {regatta.galleries.map(
                    (gallery: Gallery) =>
                      gallery.password && (
                        <>
                          <span className="hidden select-none sm:inline">
                            Password:{" "}
                          </span>
                          <Copy value={gallery.password} />
                        </>
                      ),
                  )}
                </td>
                <td className="flex gap-6">
                  {regatta.galleries.map(({ url, name }: Gallery) => {
                    if (url)
                      return (
                        <Link key={url} href={url} external>
                          {name}
                        </Link>
                      );

                    return null;
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  </Layout>
);

export default Photography;
