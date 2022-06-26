import { NextSeo } from "next-seo";
import groq from "groq";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import YearFormatter from "@/components/utils/year-formatter";
import Link from "@/components/stour/link";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";
import { GetStaticProps, InferGetStaticPropsType } from "next";

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
      }`
  );
  return {
    props: { regattas },
  };
};

export default function Photography({
  regattas,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <NextSeo
        title="Official Photography | Sudbury Regatta"
        description="Professional photography from the Sudbury Regatta."
        openGraph={{
          title: "Official Photography",
          description: "Professional photography from the Sudbury Regatta.",
          images: [{ url: `${BASE_URL}/assets/og/photography.png` }],
        }}
      />
      <HeroTitle title="Official regatta photography" breadcrumbs />
      <Container>
        <div className="py-16 prose prose-lg max-w-none">
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
                    <YearFormatter dateString={regatta.date} />
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
                            <code>{gallery.password}</code>
                          </>
                        )
                    )}
                  </td>
                  <td className="flex gap-6">
                    {regatta.galleries.map((gallery: Gallery) => {
                      if (gallery.url)
                        return (
                          <Link key={gallery.url} href={gallery.url} external>
                            {gallery.name}
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
    </Layout>
  );
}