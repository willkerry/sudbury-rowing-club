import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import styles from "@/components/governance/governance.module.css";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { DownloadIcon, ExternalLinkIcon } from "@heroicons/react/outline";

import data from "@/data/governance.json";

const GovGrid = (props) => (
  <div {...props} className="grid grid-cols-2 gap-y-12 gap-x-8 md:grid-cols-3 md:w-4/5" />
);
const Row = (props) => <section {...props} className="my-16 md:flex" />;
const StyledScrollLink = (props) => (
  <ScrollLink
    activeClass="text-gray-800"
    className="inline-block transition hover:text-gray-800 hover:cursor-pointer"
    spy={true}
    smooth={true}
    offset={-100}
    duration={200}
    {...props}
  />
);
const ScrollComponent = (props) => (
  <div className="sticky top-0 z-10 bg-white border-b">
    <div className="container max-w-screen-lg px-5 py-5 mx-auto space-x-6 text-gray-500 ">
      <StyledScrollLink to="officers">Club Officers</StyledScrollLink>
      <StyledScrollLink to="committees">Committees</StyledScrollLink>
      <StyledScrollLink to="nonexec">Non-Executive Officers</StyledScrollLink>
      <StyledScrollLink to="documents">Documents</StyledScrollLink>
    </div>
  </div>
);
const SectionTitle = (props) => (
  <h2
    {...props}
    className="mb-8 text-xl font-bold tracking-tight text-gray-800"
  />
);
const SubTitle = (props) => (
  <h3 className="pb-4 font-semibold text-gray-900" {...props} />
);
const Vacant = (props) => (
  <div className="h-8">
    <span
      className="p-1 text-xs font-semibold tracking-widest text-gray-600 border rounded bg-gray-50"
      {...props}
    >
      TBA
    </span>
  </div>
);
const OfficerName = (props) => (
  <div
    className="h-8 font-serif text-2xl tracking-tight text-gray-800"
    {...props}
  />
);
const Description = (props) => (
  <div className="mb-4 text-gray-700" {...props} />
);
const DashUl = (props) => (
  <ul className={("text-gray-600 list-inside", styles.dashList)} {...props} />
);
const DashLi = (props) => <li className="relative pl-8" {...props} />;
const DashLiFirst = (props) => (
  <li className="relative pl-8 first:font-bold" {...props} />
);

export default function Governance({ preview }) {
  const sorted = data.vicePresidents.sort(function (a, b) {
    if (a.surname.toLowerCase() < b.surname.toLowerCase()) return -1;
    if (a.surname.toLowerCase() > b.surname.toLowerCase()) return 1;
    return 0;
  });
  const sortedB = data.trustees.sort(function (a, b) {
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
      <ScrollComponent />
      <Container>
        <Row id="officers">
          <div className="md:w-1/4">
            <SectionTitle>Club Officers</SectionTitle>
          </div>
          <GovGrid>
            {data.officers.map((entry) => {
              return (
                <div key={entry.name}>
                  {entry.vacant ? (
                    <Vacant />
                  ) : (
                    <OfficerName>{entry.name}</OfficerName>
                  )}

                  <Description>{entry.role}</Description>
                </div>
              );
            })}
          </GovGrid>
        </Row>
        <Row id="committees">
          <div className="md:w-1/4">
            <SectionTitle>Committees</SectionTitle>
          </div>

          <GovGrid>
            {data.committees.map((entry) => {
              return (
                <div key={entry.name}>
                  <SubTitle>{entry.name}</SubTitle>
                  <Description>{entry.description}</Description>
                  <DashUl>
                    {entry.officers.map((sitting) => {
                      return (
                        <DashLiFirst key={sitting.toString()}>
                          {sitting}
                        </DashLiFirst>
                      );
                    })}
                  </DashUl>
                </div>
              );
            })}
          </GovGrid>
        </Row>
        <div id="nonexec" className={styles.fullWidthContainer + " bg-gray-50"}>
          <Container>
            <Row>
              <div className="md:w-1/4">
                <SectionTitle>Non-Executive Officers</SectionTitle>
              </div>
              <GovGrid>
                <div>
                  <SubTitle>President</SubTitle>
                  <Description>{data.presidentDescription}</Description>
                </div>
                <div className="col-start-1">
                  <SubTitle>Vice-Presidents</SubTitle>
                  <Description>{data.vicePresidentDescription}</Description>
                </div>

                <div className={styles.threeColFlow}>
                  <DashUl>
                    {data.vicePresidents.map((entry, index) => {
                      return (
                        <DashLi key={index}>
                          {entry.firstName} {entry.surname}
                        </DashLi>
                      );
                    })}
                  </DashUl>
                </div>
                <div className="col-start-1">
                  <SubTitle>Trustees</SubTitle>
                </div>
                <div>
                  <DashUl>
                    {data.trustees.map((entry, index) => {
                      return (
                        <DashLi key={index}>
                          {entry.firstName} {entry.surname}
                        </DashLi>
                      );
                    })}
                  </DashUl>
                </div>
              </GovGrid>
            </Row>
          </Container>
        </div>

        <div
          id="documents"
          className={styles.fullWidthContainer + " bg-blue-50"}
        >
          <Container>
            <Row>
              <div className="md:w-1/4">
                <SectionTitle>Documents</SectionTitle>
              </div>
              <GovGrid>
                {data.documents.map((groups) => {
                  return (
                    <div key={groups.group.toString()}>
                      <SubTitle>{groups.group}</SubTitle>
                      {groups.items.map((item) => {
                        return (
                          <p
                            key={item.name.toString()}
                            className="my-2 text-sm leading-tight text-gray-600 align-baseline hover:text-gray-800"
                          >
                            <Link href={item.href}>
                              <a>
                                <span>{item.name}</span>
                                {item.external && !item.download && (
                                  <span>
                                    &nbsp;
                                    <ExternalLinkIcon className="inline-flex w-3 h-3 mb-0.5 opacity-50" />
                                  </span>
                                )}
                                {item.download && (
                                  <span>
                                    &nbsp;
                                    <DownloadIcon className="inline-flex w-3 h-3 mb-0.5 opacity-50" />
                                  </span>
                                )}
                              </a>
                            </Link>
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
              </GovGrid>
            </Row>
          </Container>
        </div>
      </Container>
    </Layout>
  );
}
