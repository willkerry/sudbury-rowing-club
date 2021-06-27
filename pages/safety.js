import Head from "next/head";
import Container from "../components/container";
import HeroTitle from "../components/hero-title";
import Layout from "../components/layout";
import DateTimeFormatter from "@/components/datetime-formatter";
import styles from "../components/governance/governance.module.css";
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

import safety from "../data/safety.json";

export default function Safety({ preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Safety</title>
      </Head>
      <HeroTitle title="Safety" />
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
        {safety.status.display ? (
          <div className={styles.row}>
            <div className="md:w-1/3"></div>

            <div className="flex p-6 border-2 rounded-lg max-w-prose md:w-2/3">
              <div>
                <div
                  className={cn("w-12 h-12 mr-4 border rounded-full", {
                    "bg-red-600": safety.status.severity == "Red",
                    "bg-yellow-500": safety.status.severity == "Amber",
                    "bg-green-600": safety.status.severity == "Green",
                    "bg-sudbury": safety.status.severity == "Neutral",
                  })}
                />
              </div>
              <div>
                <h2 className="text-xs font-medium tracking-wide uppercase">
                  River Safety Status
                </h2>
                <h3 className="text-2xl font-bold text-gray-900">
                  {safety.status.severity}
                </h3>
                <div className="prose">
                  {safety.status.description}
                  <div className="flex flex-col pt-3 space-y-1 text-sm lg:flex-row lg:space-y-0 lg:space-x-4">
                    {safety.status.date && (
                      <div>
                        Updated{" "}
                        <DateTimeFormatter dateString={safety.status.date} />
                      </div>
                    )}
                    <div>
                      <a
                        href="https://flood-warning-information.service.gov.uk/warnings?location=+Sudbury"
                        className=""
                      >
                        Environment&nbsp;Agency
                      </a>
                    </div>
                    <div>
                      <a
                        href="https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings"
                        className=""
                      >
                        Met&nbsp;Office
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {safety.safety.map((item) => {
          return (
            <div
              key={item.name.toString()}
              id={item.name.toString()}
              className={styles.row}
            >
              <div className="md:w-1/3">
                <h2 className={styles.sectionTitle}>{item.name}</h2>
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
                  <Link href={item.link.file}>
                    <a
                      href={item.link.file}
                      className="inline-block px-3 py-2 font-medium transition border-2 rounded-md hover:border-gray-400 group"
                    >
                      {item.link.name}
                      {item.link.type == "download" ? (
                        <span>
                          <DownloadIcon className="inline w-5 h-5 ml-1 text-gray-400 align-text-bottom transition group-hover:text-gray-600" />
                        </span>
                      ) : (
                        <ExternalLinkIcon className="inline w-5 h-5 ml-1 text-gray-400 align-text-bottom transition group-hover:text-gray-600" />
                      )}
                    </a>
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        <div
          id="documents"
          className={styles.fullWidthContainer + " bg-sudbury-lightest"}
        >
          <div className={styles.govContainer}>
            <div className={styles.row}>
              <div className="md:w-1/3">
                <h2 className={styles.sectionTitle}>Documents</h2>
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
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
