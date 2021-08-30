import SafetyPopup from "@/components/safety";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { Download } from "react-feather";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import data from "@/data/safety.json";
import Skeleton from "@/components/stour/skeleton";

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
      <HeroTitle title="Safety" />
      <Container>
        {showStatus && (
          <Row>
            <div className="md:w-1/3"></div>

            <div className="border rounded-lg max-w-prose md:w-2/3">
              <SafetyPopup />
            </div>
          </Row>
        )}
        {items.map((item) => {
          return (
            <Row key={item.name.toString()} id={item.name.toString()}>
              <div className="md:w-1/3">
                <SectionTitle>{item.name}</SectionTitle>
              </div>

              <div className="space-y-6 md:w-2/3">
                {item.description && (
                  <div className="prose">
                    <ReactMarkdown>{item.description}</ReactMarkdown>
                    {item.date && <small>Last updated {item.date}</small>}
                  </div>
                )}
                {item.link && (
                  <Button href={item.link.file} icon={item.link.type}>
                    {item.link.name}
                  </Button>
                )}
              </div>
            </Row>
          );
        })}
        <Row>
          <div className="md:w-1/3">
            <SectionTitle>Documents</SectionTitle>
          </div>
          <div className="md:w-2/3">
            {docs.map((item) => (
              <p
                key={item.name.toString()}
                className="my-2 leading-tight text-gray-600 hover:text-gray-800"
              >
                <Link href={item.file}>
                  <a>
                    {item.name}{" "}
                    <Download className="inline w-4 h-4 mb-1 opacity-50" />
                  </a>
                </Link>
              </p>
            ))}
          </div>
        </Row>
      </Container>
    </Layout>
  );
}
