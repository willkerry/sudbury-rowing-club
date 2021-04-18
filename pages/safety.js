import Head from "next/head";
import Container from "../components/container";
import HeroTitle from "../components/hero-title";
import Layout from "../components/layout";
import styles from "../components/governance/governance.module.css";
import {
  Link as ScrollLink
} from "react-scroll";

import {
  officers as clubOfficers,
  committees,
  presidentDescription,
  vicePresidentDescription,
  vicePresidents,
  trustees,
} from "../data/governance.json";

export default function Governance({ preview }) {
  const sorted = vicePresidents.sort(function (a, b) {
    if (a.surname.toLowerCase() < b.surname.toLowerCase()) return -1;
    if (a.surname.toLowerCase() > b.surname.toLowerCase()) return 1;
    return 0;
  });
  const sortedB = trustees.sort(function (a, b) {
    if (a.surname.toLowerCase() < b.surname.toLowerCase()) return -1;
    if (a.surname.toLowerCase() > b.surname.toLowerCase()) return 1;
    return 0;
  });

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
            className={styles.scrollLink + ' transition'}
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
            className={styles.scrollLink + ' transition'}
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
            className={styles.scrollLink + ' transition'}
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
            className={styles.scrollLink + ' transition'}
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
        <div className={styles.row} id="officers">
          <div className="md:w-1/5">
            <h2 className={styles.sectionTitle}>Club Officers</h2>
          </div>
          <div className={styles.govGrid}>
            {clubOfficers.map((entry) => {
              return (
                <div key={entry.name}>
                  <div className={styles.officerName}>{entry.name}</div>
                  <div>{entry.role}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div id="committees" className={styles.row}>
          <div className="md:w-1/5">
            <h2 className={styles.sectionTitle}>Committees</h2>
          </div>
          <div className={styles.govGrid}>
            {committees.map((entry) => {
              return (
                <div key={entry.name}>
                  <h3 className={styles.subTitle}>{entry.name}</h3>
                  <p className={styles.description}>{entry.description}</p>
                  <ul className={styles.dashList}>
                    {entry.officers.map((sitting) => {
                      return (
                        <li
                          className="first:font-bold"
                          key={sitting.toString()}
                        >
                          {sitting}
                        </li>
                      );
                    })}
                  </ul>
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
