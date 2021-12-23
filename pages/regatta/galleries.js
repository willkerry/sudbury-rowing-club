import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import tinytime from "tinytime";
import groq from "groq";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Link from "@/components/stour/link";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";

const propTypesGalleries = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    password: PropTypes.string,
  })
);
const propTypeGalleryData = PropTypes.arrayOf(
  PropTypes.shape({
    _id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    galleries: propTypesGalleries.isRequired,
  })
);

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
            <GalleryTbody data={data} />
          </table>
        </div>
      </Container>
    </Layout>
  );
}
Photography.propTypes = {
  data: propTypeGalleryData.isRequired,
};

function GalleryLink({ href, name }) {
  return (
    <Link href={href} external>
      {name}
    </Link>
  );
}

GalleryLink.propTypes = {
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function GalleryPassword({ password }) {
  return (
    <>
      <span className="hidden select-none sm:inline">Password: </span>
      <code>{password}</code>
    </>
  );
}

GalleryPassword.propTypes = {
  password: PropTypes.string.isRequired,
};

function GalleryRow({ year, galleries }) {
  return (
    <tr>
      <th>
        {formatDate(new Date(year))}
        <span className="hidden sm:inline"> Regatta</span>
      </th>
      <td className="!align-middle">
        {galleries.map(
          ({ password }) =>
            password && <GalleryPassword key={password} password={password} />
        )}
      </td>
      <td className="flex gap-6">
        {galleries.map(({ name, url }) => (
          <GalleryLink key={url} href={url} name={name} />
        ))}
      </td>
    </tr>
  );
}
GalleryRow.propTypes = {
  year: PropTypes.string.isRequired,
  galleries: propTypesGalleries.isRequired,
};

function GalleryTbody({ data }) {
  return (
    <tbody>
      {data.map(({ _id, date, galleries }) => (
        <GalleryRow key={_id} year={date} galleries={galleries} />
      ))}
    </tbody>
  );
}

GalleryTbody.propTypes = {
  data: propTypeGalleryData.isRequired,
};

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
    props: { data },
    revalidate: 7200,
  };
};
