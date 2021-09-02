import SafetyPopup from "@/components/safety";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { Download, ExternalLink } from "react-feather";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import data from "@/data/safety.json";
import Skeleton from "@/components/stour/skeleton";
import { BASE_URL } from "lib/constants";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  loading: () => Skeleton(),
});
const Button = dynamic(() => import("@/components/stour/button"));

export const getStaticProps = async () => {
  return {
    props: {
      items: await data.safety,
      docs: await data.documents,
      showStatus: await data.status.display,
    },
    revalidate: 60,
  };
};

const Row = (props) => <section {...props} className="my-16 md:flex" />;

const SectionTitle = (props) => (
  <h2
    {...props}
    className="mb-8 text-xl font-bold tracking-tight text-gray-800 md:pr-6"
  />
);

export default function Safety({ items, docs, showStatus }) {
  return (
    <Layout>
      <Head>
        <title>Safety</title>
      </Head>
      <HeroTitle prose title="Safety" />
      <Container className="mx-auto my-12 space-y-16 max-w-prose">
        {showStatus && (
          <div className="border rounded-lg">
            <SafetyPopup />
          </div>
        )}
        {items.map((item) => {
          return (
            <div
              key={item.name.toString()}
              id={item.name.toString()}
              className="space-y-6"
            >
              <SectionTitle>{item.name}</SectionTitle>
              {item.description && (
                <div className="prose">
                  <ReactMarkdown>{item.description}</ReactMarkdown>
                  {item.date && <small>Last updated {item.date}</small>}
                </div>
              )}
              {item.link && (
                <Button
                  href={item.link.file}
                  variant="brand"
                  iconRight={
                    item.link.file.includes(BASE_URL) ? (
                      <Download />
                    ) : (
                      <ExternalLink />
                    )
                  }
                >
                  {item.link.name}
                </Button>
              )}
            </div>
          );
        })}
        <div>
          <SectionTitle>Documents</SectionTitle>
          {docs.map((item) => (
            <div key={item.name.toString()} className="my-2">
              <Button href={item.file} iconRight={<Download />} size="small">
                {item.name}
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </Layout>
  );
}
