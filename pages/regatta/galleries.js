import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Link from "@/components/stour/link";
import { BASE_URL } from "@/lib/constants";
import { NextSeo } from "next-seo";
import { sanityClient } from "@/lib/sanity.server";
import groq from "groq";
import tinytime from "tinytime";

const formatDate = tinytime("{YYYY}").render;

export default function Photography({ data }) {
  return (
    <Layout>
      <NextSeo
        title="Official Photography | Sudbury Regatta"
        description="Professional photography from the Sudbury Regatta."
        openGraph={{
          title: "Official Photography",
          description: "Professional photography from the Sudbury Regatta.",
          images: [{ url: BASE_URL + "/assets/og/photography.png" }],
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
            <GalleryTbody data={data} />
          </table>
        </div>
      </Container>
    </Layout>
  );
}

function GalleryLink({ index, href, name }) {
  return (
    <Link key={index} href={href} external>
      {name}
    </Link>
  );
}

function GalleryPassword({ password }) {
  return (
    <>
      <span className="hidden select-none sm:inline">Password: </span>
      <code>{password}</code>
    </>
  );
}

function GalleryRow({ year, galleries }) {
  return (
    <tr>
      <th>
        {formatDate(new Date(year))}
        <span className="hidden sm:inline"> Regatta</span>
      </th>
      <td className="!align-middle">
        {galleries.map(
          ({ password }, index) =>
            password && <GalleryPassword key={index} password={password} />
        )}
      </td>
      <td className="flex gap-6">
        {galleries.map(({ name, url }, index) => (
          <GalleryLink key={index} href={url} name={name} />
        ))}
      </td>
    </tr>
  );
}

function GalleryTbody({ data }) {
  return (
    <tbody>
      {data.map(({ _id, date, galleries }) => (
        <GalleryRow key={_id} year={date} galleries={galleries} />
      ))}
    </tbody>
  );
}

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`
      *[_type == "regattas" && galleries != null] | order(date desc) {
        _id,
        date, 
        galleries
      }
    `
  );
  return {
    props: {
      data,
    },
  };
};
