import Head from "next/head";
import Container from "../components/container";
import HeroTitle from "../components/hero-title";
import Layout from "../components/layout";
import styles from "../components/governance/governance.module.css";
import Link from "next/link";
import { DocumentDownloadIcon } from "@heroicons/react/outline";
import Button from "@/components/stour/button";
import SafetyPopup from "@/components/safety";
import ReactMarkdown from "react-markdown";
import smartypants from "@silvenon/remark-smartypants";

import data from "../data/safety.json";

export const getStaticProps = async () => {
  return {
    props: {
      safety: await data,
    },
    revalidate: 60,
  };
};

const Row = (props) => <section {...props} className="my-16 md:flex" />;

const SectionTitle = (props) => (
  <h2
    {...props}
    className="mb-8 text-xl font-bold tracking-tight text-gray-800"
  />
);

export default function Safety({ safety }) {
  return (
    <Layout>
      <Head>
        <title>Safety</title>
      </Head>
      <HeroTitle title="Safety" />

      <Container>
        {safety.status.display && (
          <Row>
            <div className="md:w-1/3"></div>

            <div className="border rounded-lg max-w-prose md:w-2/3">
              <SafetyPopup />
            </div>
          </Row>
        )}
        {safety.safety.map((item) => {
          return (
            <Row key={item.name.toString()} id={item.name.toString()}>
              <div className="md:w-1/3">
                <SectionTitle>{item.name}</SectionTitle>
              </div>

              <div className="space-y-6 md:w-2/3">
                {item.description && (
                  <div className="prose">
                    <ReactMarkdown remarkPlugins={[smartypants]}>
                      {item.description}
                    </ReactMarkdown>

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

        <div
          id="documents"
          className={styles.fullWidthContainer + " bg-blue-50"}
        >
          <Container>
            <Row>
              <div className="md:w-1/3">
                <SectionTitle>Documents</SectionTitle>
              </div>
              <div className="md:w-2/3">
                {safety.documents.map((item) => (
                  <p
                    key={item.name.toString()}
                    className="my-2 leading-tight text-gray-600 hover:text-gray-800"
                  >
                    <Link href={item.file}>
                      <a>
                        {item.name}{" "}
                        <DocumentDownloadIcon className="inline w-4 h-4 mb-1 opacity-50" />
                      </a>
                    </Link>
                  </p>
                ))}
              </div>
            </Row>
          </Container>
        </div>
      </Container>
    </Layout>
  );
}
