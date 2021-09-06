import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import { Link as ScrollLink } from "react-scroll";
import Link from "@/components/stour/link";
import rawData from "@/data/governance.json";
import { HelpCircle, Image as ImageIcon, Info, XCircle } from "react-feather";
import cn from "classnames";
import { Popover, Transition } from "@headlessui/react";
import { NextSeo } from "next-seo";

export const getStaticProps = async () => {
  return {
    props: {
      data: await rawData,
    },
    revalidate: 60,
  };
};

const GovGrid = ({ children }) => (
  <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
    {children}
  </div>
);
const StyledScrollLink = (props) => (
  <ScrollLink
    activeClass="text-gray-800"
    className="inline-block mr-6 transition hover:text-gray-800 hover:cursor-pointer"
    spy={true}
    smooth={true}
    offset={-100}
    duration={200}
    {...props}
  />
);
const ScrollComponent = ({ items }) => (
  <div className="sticky top-0 z-10 bg-white border-b">
    <div className="container max-w-screen-lg px-5 py-5 mx-auto text-gray-500 ">
      {items.map((item, index) => (
        <StyledScrollLink key={index} to={item.to}>
          {item.name}
        </StyledScrollLink>
      ))}
    </div>
  </div>
);
const SectionTitle = (props) => (
  <h2
    className={cn(
      "mt-24 mb-6 text-2xl font-bold tracking-tight text-gray-800",
      props.className
    )}
    {...props}
  />
);
const SubTitle = (props) => (
  <h3
    className={cn("mb-0.5 mt-8 font-semibold text-gray-900", props.className)}
    {...props}
  />
);
const Vacant = () => (
  <div className="h-8">
    <span className="p-1 text-xs font-semibold tracking-widest text-gray-600 border rounded bg-gray-50">
      TBA
    </span>
  </div>
);
const OfficerName = (props) => (
  <div
    className="text-base font-semibold tracking-tight text-gray-800 sm:text-lg"
    {...props}
  />
);
const Description = (props) => (
  <div
    className={cn("text-sm text-gray-700 sm:text-base", props.className)}
    {...props}
  />
);
const DashUl = (props) => (
  <ul className="mt-6 text-gray-600 list-inside" {...props} />
);
const DashLi = (props) => (
  <li
    className="relative pl-8 before:content-['\2014\a0'] before:font-normal before:absolute before:left-0 before:text-gray-300"
    {...props}
  />
);
const DashLiFirst = (props) => (
  <li
    className="relative pl-8 first:font-medium first:text-gray-800 before:content-['\2014\a0'] before:font-normal before:absolute before:left-0 before:text-gray-300"
    {...props}
  />
);

export default function Governance({ data }) {
  const sortedVicePresidents = data.vicePresidents.sort(function (a, b) {
    if (a.surname.toLowerCase() < b.surname.toLowerCase()) return -1;
    if (a.surname.toLowerCase() > b.surname.toLowerCase()) return 1;
    return 0;
  });
  const sorsortedTrustees = data.trustees.sort(function (a, b) {
    if (a.surname.toLowerCase() < b.surname.toLowerCase()) return -1;
    if (a.surname.toLowerCase() > b.surname.toLowerCase()) return 1;
    return 0;
  });

  return (
    <Layout>
      <NextSeo
        title="Governance"
        openGraph={{
          title: "Governance",
          images: [{ url: BASE_URL + "assets/og/goverance.png" }],
        }}
      />
      <HeroTitle title="Governance" prose />
      <ScrollComponent
        items={[
          { to: "officers", name: "Officers" },
          { to: "committees", name: "Committees" },
          { to: "nonexec", name: "Non-Exec" },
          { to: "documents", name: "Documents" },
        ]}
      />

      <Container>
        <section id="officers">
          <SectionTitle>Club Officers</SectionTitle>
          <GovGrid>
            {data.officers.map((entry, index) => {
              return (
                <div key={index}>
                  <div
                    className={cn(
                      "flex items-center justify-center w-full mb-2 rounded-lg h-36 relative overflow-hidden",
                      !entry.vacant &&
                        "bg-gradient-to-b from-gray-200 to-gray-100"
                    )}
                  >
                    {!entry.vacant && (
                      <>
                        <ImageIcon className="text-gray-400" />

                        <Popover className="">
                          <Popover.Button>
                            <HelpCircle
                              className="absolute text-blue-500 transition right-2 bottom-2 hover:text-gray-700"
                              size="1em"
                              strokeWidth="0.15em"
                            />
                          </Popover.Button>
                          <Transition
                            enter="transition-opacity duration-150 ease-in-out"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition duration-75 ease-in-out"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute top-0 left-0 w-full h-full p-4 bg-white bg-opacity-50 rounded-lg backdrop-blur">
                              <div className="text-xs font-medium text-gray-600">
                                <p>Image not currently available.</p>
                              </div>
                              <Popover.Button>
                                <XCircle
                                  className="absolute text-gray-500 transition hover:text-gray-700 right-2 bottom-2"
                                  size="1em"
                                  strokeWidth="0.15em"
                                />
                              </Popover.Button>
                            </Popover.Panel>
                          </Transition>
                        </Popover>
                      </>
                    )}
                  </div>
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
        </section>
        <section id="committees">
          <SectionTitle>Committees</SectionTitle>

          <GovGrid>
            {data.committees.map((entry, index) => {
              return (
                <div key={index}>
                  <SubTitle>{entry.name}</SubTitle>
                  <Description>{entry.description}</Description>
                  <DashUl>
                    {entry.officers.map((sitting, index) => {
                      return <DashLiFirst key={index}>{sitting}</DashLiFirst>;
                    })}
                  </DashUl>
                </div>
              );
            })}
          </GovGrid>
        </section>
        <section id="nonexec">
          <SectionTitle>Non-Executive Officers</SectionTitle>
          <GovGrid>
            <div>
              <SubTitle>President</SubTitle>
              <Description>{data.presidentDescription}</Description>
            </div>
            <div className="col-start-1">
              <SubTitle>Vice-Presidents</SubTitle>
              <Description>{data.vicePresidentDescription}</Description>
            </div>
            <div className="col-span-4 sm:masonry-2-col md:masonry-4-col">
              <DashUl>
                {sortedVicePresidents.map((entry, index) => {
                  return (
                    <DashLi key={index}>
                      {entry.firstName} {entry.surname}
                    </DashLi>
                  );
                })}
              </DashUl>
            </div>
            <div className="col-span-1">
              <SubTitle>Trustees</SubTitle>
            </div>
            <div className="col-span-4">
              <DashUl>
                {sorsortedTrustees.map((entry, index) => {
                  return (
                    <DashLi key={index}>
                      {entry.firstName} {entry.surname}
                    </DashLi>
                  );
                })}
              </DashUl>
            </div>
          </GovGrid>
        </section>

        <section id="documents" className="py-12">
          <SectionTitle>Documents</SectionTitle>
          {data.documents.map((groups, index) => {
            return (
              <div key={index} className="mt-6">
                <SubTitle>{groups.group}</SubTitle>
                <ul className="space-y-1">
                  {groups.items.map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          download={item.download}
                          external={item.external}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </section>
      </Container>
    </Layout>
  );
}
