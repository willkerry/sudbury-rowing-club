import Head from "next/head";
import Container from "../components/container";
import HeroTitle from "../components/hero-title";
import Layout from "../components/layout";
import styles from "../components/governance/governance.module.css";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";

import ReactMarkdown from "react-markdown";
import smartypants from "@silvenon/remark-smartypants";

import {
  officers as clubOfficers,
  committees,
  presidentDescription,
  vicePresidentDescription,
  vicePresidents,
  trustees,
} from "../data/governance.json";

import { safety } from "../data/safety.json";

export default function Governance({ preview }) {
  return (
    <Layout preview={preview}>
      <Head>
        <title>Governance</title>
      </Head>
      <HeroTitle title="Governance" />
      <div className="sticky top-0 bg-white border-b">
        <div className="container px-5 py-5 mx-auto space-x-6 text-gray-500 ">
          <ScrollLink
            activeClass="text-gray-800"
            className={styles.scrollLink + " transition"}
            to="officers"
            spy={true}
            smooth={true}
            offset={-100}
            duration={200}
          >
            Club Officers
          </ScrollLink>
          <ScrollLink
            activeClass="text-gray-800"
            className={styles.scrollLink + " transition"}
            to="committees"
            spy={true}
            smooth={true}
            offset={-100}
            duration={200}
          >
            Committees
          </ScrollLink>
          <ScrollLink
            activeClass="text-gray-800"
            className={styles.scrollLink + " transition"}
            to="nonexec"
            spy={true}
            smooth={true}
            offset={-100}
            duration={200}
          >
            Non-Executive Officers
          </ScrollLink>
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
      </div>
      <Container>
        {safety.map((item) => {
          return (
            <div id={item.name} className={styles.row}>
              <div className="md:w-1/3">
                <h2 className={styles.sectionTitle}>{item.name}</h2>
              </div>

              <div className="md:w-2/3">
                {item.link.file && (
                  <a className="px-3 py-2 font-medium transition border-2 rounded-md hover:border-gray-500">
                    <Link href={item.link.file}>{item.link.name}</Link>
                  </a>
                )}
                <div className="prose">
                  {item.description && (
                    <ReactMarkdown remarkPlugins={[smartypants]}>
                      {item.description}
                    </ReactMarkdown>
                  )}
                  {item.date && <small>Last updated {item.date}</small>}
                </div>
              </div>
            </div>
          );
        })}
        <div id="committees" className={styles.row}>
          <div className="md:w-1/5">
            <h2 className={styles.sectionTitle}>Covid-19</h2>
          </div>
          <div className={styles.govGrid}>
            {committees.map((entry) => {
              return (
                <div key={entry.name}>
                  <h3 className={styles.subTitle}>{entry.name}</h3>
                  <p className={styles.description}>{entry.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div id="nonexec" className={styles.fullWidthContainer + " bg-gray-50"}>
          <div className={styles.govContainer}>
            <div className={styles.row}>
              <div className="md:w-1/5">
                <h2 className={styles.sectionTitle}>Non-Executive</h2>
              </div>
              <div className={styles.govGrid}>
                <div>
                  <h3 className={styles.subTitle}>President</h3>
                  <p className={styles.description} Î>
                    {presidentDescription}
                  </p>
                </div>
                <div className="col-start-1">
                  <h3 className={styles.subTitle}>Vice-Presidents</h3>
                  <p className={styles.description}>
                    {vicePresidentDescription}
                  </p>
                </div>

                <div className={styles.threeColFlow}>
                  <ul className={styles.dashList}>
                    {vicePresidents.map((entry) => {
                      return (
                        <li key={entry.surname}>
                          {entry.firstName} {entry.surname}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="col-start-1">
                  <h3 className={styles.subTitle}>Trustees</h3>
                </div>
                <div>
                  <ul className={styles.dashList}>
                    {trustees.map((entry) => {
                      return (
                        <li key={entry.surname}>
                          {entry.firstName} {entry.surname}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="documents"
          className={styles.fullWidthContainer + " bg-sudbury-lightest"}
        >
          <div className={styles.govContainer}>
            <div className={styles.row}>
              <div className="md:w-1/5">
                <h2 className={styles.sectionTitle}>Documents</h2>
              </div>
              <div className={styles.govGrid}>
                <div>
                  <h3 className={styles.subTitle}>President</h3>
                  <p className={styles.description} Î>
                    {presidentDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
