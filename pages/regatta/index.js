import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import DayDateFormatter from "@/components/daydate-formatter";
import styles from "@/components/governance/governance.module.css";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import {
  DocumentDownloadIcon,
  DownloadIcon,
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import cn from "classnames";

import ReactMarkdown from "react-markdown";
import smartypants from "@silvenon/remark-smartypants";

import { safety, documents, status } from "@/data/safety.json";
import { regattaIntro } from "@/data/regatta.json";

export default function Safety({ preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Regatta</title>
      </Head>
      {/* <div className="sticky top-0 bg-white border-b">
        <div className="container px-5 py-5 mx-auto space-x-6 text-gray-500 ">
          {safety.map((item) => (
            <ScrollLink
              activeClass="text-gray-800"
              className={styles.scrollLink + " transition"}
              to={item.name.toString()}
              spy={true}
              smooth={true}
              offset={-100}
              duration={200}
            >
              {item.name}
            </ScrollLink>
          ))}
          <ScrollLink
            activeClass="text-gray-800"
            className={styles.scrollLink + " transition"}
            to="documents"
            spy={true}
            smooth={true}
            offset={-100}
            duration={200}
          >
            Documents
          </ScrollLink>
        </div>
      </div> */}
      <Container>
        <div className={styles.row}>
          <div className="mx-auto space-y-3">
            <span className="font-semibold tracking-wide text-gray-700 uppercase">
              <DayDateFormatter dateString={regattaIntro.date} />
            </span>
            <h1 className="pb-6 font-serif text-4xl font-normal tracking-tight">
              {regattaIntro.title}
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <div className="prose">
                <ReactMarkdown remarkPlugins={[smartypants]}>
                  {regattaIntro.description}
                </ReactMarkdown>
              </div>
              <div className="prose">
                <div className="px-8 pt-1 pb-2 text-green-900 bg-green-300 rounded-lg">
                  <h4>{regattaIntro.note.title}</h4>
                  <ReactMarkdown remarkPlugins={[smartypants]}>
                    {regattaIntro.note.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
