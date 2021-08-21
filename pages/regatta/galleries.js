import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import rawData from "@/data/galleries";
import Link from "next/link";
import { ExternalLink } from "react-feather";

export const getStaticProps = async () => {
  return {
    props: {
      data: await rawData,
    },
    revalidate: 60,
  };
};

export default function Photography({ preview, data }) {
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
            <GalleryTbody data={data} />
          </table>
        </div>
      </Container>
    </Layout>
  );
}

function GalleryLink({ index, href, name }) {
  return (
    <Link key={index} href={href}>
      <a className="inline-block pr-4 last-of-type:pr-0">
        {name}
        <ExternalLink size={12} className="inline mb-1 ml-1" />
      </a>
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

function GalleryRow({ index, year, password, provider }) {
  return (
    <tr key={index}>
      <th>
        {year}
        <span className="hidden sm:inline"> Regatta</span>
      </th>
      <td className="!align-middle">
        {password && <GalleryPassword password={password} />}
      </td>
      <td>
        {provider.map(({ name, href, index }) => (
          <GalleryLink key={index} index={index} href={href} name={name} />
        ))}
      </td>
    </tr>
  );
}

function GalleryTbody({ data }) {
  return (
    <tbody>
      {data.map(({ year, password, provider, index }) => (
        <GalleryRow
          key={index}
          year={year}
          password={password}
          provider={provider}
        />
      ))}
    </tbody>
  );
}
