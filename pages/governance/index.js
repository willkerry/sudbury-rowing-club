import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Link from "@/components/stour/link";
import data from "@/data/governance.json";
import { BASE_URL } from "@/lib/constants";
import { Popover, Transition } from "@headlessui/react";
import cn from "classnames";
import { NextSeo } from "next-seo";
import { HelpCircle, Image as ImageIcon, XCircle } from "react-feather";
import { Link as ScrollLink } from "react-scroll";
import groq from "groq";
import { sanityClient } from "@/lib/sanity.server";

const GovGrid = ({ children }) => (
  <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
    {children}
  </div>
);
const StyledScrollLink = (props) => (
  <ScrollLink
    activeClass="text-gray-900 bg-gray-100"
    className="block p-2 mr-4 -m-2 transition rounded-md whitespace-nowrap hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
    spy={true}
    smooth={true}
    offset={-100}
    duration={200}
    {...props}
  />
);
const ScrollComponent = ({ items }) => (
  <div className="sticky top-0 z-10 bg-white border-b">
    <div className="container flex items-center h-16 max-w-screen-lg px-5 mx-auto overflow-scroll text-gray-500">
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
      "mt-16 mb-6 text-2xl font-bold tracking-tight text-gray-800",
      props.className
    )}
    {...props}
  />
);
const SubTitle = (props) => (
  <h3
    className={cn("mb-0.5 font-semibold text-gray-900", props.className)}
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
  <div className="font-semibold text-gray-800 tracking-snug" {...props} />
);
const Description = (props) => (
  <div className={cn("text-gray-700", props.className)} {...props} />
);
const Spacer = (props) => <div className="h-4" {...props} />;
const DashUl = (props) => <ul className="" {...props} />;
const DashLi = (props) => (
  <li className="relative mb-3 text-gray-800 committee-member" {...props} />
);
const DashLiFirst = (props) => (
  <>
    <li
      className="relative mb-3 ml-4 text-gray-800 first:before:text-gray-400 committee-member"
      {...props}
    />
    <style jsx>{`
      .committee-member:first-child::before {
        writing-mode: vertical-rl;
        font-weight: 600;
        content: 'Chair';
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-size: 0.5rem;
        line-height: 1;
        position: absolute;
        left: -1rem;
        top: .3rem;

    `}</style>
  </>
);

export default function Governance({
  officers,
  committees,
  vicePresidents,
  trustees,
  documents,
}) {
  /* const sortedVicePresidents = data.vicePresidents.sort(function (a, b) {
    if (a.surname.toLowerCase() < b.surname.toLowerCase()) return -1;
    if (a.surname.toLowerCase() > b.surname.toLowerCase()) return 1;
    return 0;
  });
  const sorsortedTrustees = data.trustees.sort(function (a, b) {
    if (a.surname.toLowerCase() < b.surname.toLowerCase()) return -1;
    if (a.surname.toLowerCase() > b.surname.toLowerCase()) return 1;
    return 0;
  }); */
  console.log(documents);
  return (
    <Layout>
      <NextSeo
        title="Governance"
        openGraph={{
          title: "Governance",
          images: [{ url: BASE_URL + "/assets/og/goverance.png" }],
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

      <Container className="my-16">
        <section id="officers">
          <SectionTitle>Club Officers</SectionTitle>
          <GovGrid>
            {officers.map((officer) => {
              return (
                <div key={officer._id}>
                  <div
                    className={cn(
                      "flex items-center justify-center w-full mb-2 rounded h-36 relative overflow-hidden",
                      !officer.vacant &&
                        "bg-gradient-to-b from-gray-200 to-gray-100"
                    )}
                  >
                    {!officer.vacant && (
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
                            <Popover.Panel className="absolute top-0 left-0 w-full h-full p-4 bg-white bg-opacity-50 rounded backdrop-blur">
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
                  {officer.vacant ? (
                    <Vacant />
                  ) : (
                    <OfficerName>{officer.name}</OfficerName>
                  )}
                  <Description>{officer.role}</Description>
                </div>
              );
            })}
          </GovGrid>
        </section>
        <section id="committees">
          <SectionTitle>Committees</SectionTitle>

          <GovGrid>
            {committees.map((committee) => {
              return (
                <div key={committee._id}>
                  <SubTitle>{committee.title}</SubTitle>
                  <Description>{committee.description}</Description>
                  <Spacer />
                  <DashUl>
                    {committee.members !== null &&
                      committee.members.map((member) => {
                        return (
                          <DashLiFirst key={member._id}>
                            <div className="text-sm font-medium text-gray-700">
                              {member.role}
                            </div>
                            <div className="text-xs text-gray-500">
                              {member.name}
                            </div>
                          </DashLiFirst>
                        );
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
              <Description>
                By convention, the mayor of Sudbury is invited to be club
                president.
              </Description>
            </div>
            <div className="">
              <SubTitle>Vice-Presidents</SubTitle>
              <Description>
                Vice-presidents are elected each year at the AGM.
              </Description>
              <Spacer />
              <ul className="text-sm text-gray-600">
                {vicePresidents !== null &&
                  vicePresidents.map((vicePresident) => {
                    return (
                      <li key={vicePresident._id}>
                        {vicePresident.firstName} {vicePresident.surname}
                      </li>
                    );
                  })}
              </ul>
            </div>

            <div>
              <SubTitle>Trustees</SubTitle>
              <ul className="text-sm text-gray-600">
                {trustees !== null &&
                  trustees.map((trustee) => {
                    return (
                      <li key={trustee._id}>
                        {trustee.firstName} {trustee.surname}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </GovGrid>
        </section>

        <section id="documents" className="py-12">
          <SectionTitle>Documents</SectionTitle>
          {documents.map((group) => {
            return (
              <div key={group._key} className="mt-6">
                <SubTitle>{group.groupTitle}</SubTitle>
                <ul className="space-y-1">
                  {group.resources.map((doc) => {
                    return (
                      <li key={doc._key}>
                        <Link
                          href={doc.url ? doc.url : `${doc.file}?dl=`}
                          download={doc.fileOrLink == "Upload a file"}
                          external={
                            doc.fileOrLink == "Enter a link" &&
                            !doc.url.includes(BASE_URL) &&
                            doc.url.includes("http")
                          }
                        >
                          {doc.name}
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

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`{
      "officers": *[_type == "officers" && !(_id in path("drafts.**"))] | order(order asc){
        _id,
        name,
        role,
        vacant
      },
      "committees": *[_type == "committees" && !(_id in path("drafts.**"))] | order(title desc){
        _id,
        title,
        description,
        members[]-> {_id, role, name}
      },
      "vicePresidents": *[_type == "vicePresidents" && !(_id in path("drafts.**"))] | order(surname asc){
        _id,
        firstName,
        surname
      },
      "trustees": *[_type == "trustees" && !(_id in path("drafts.**"))] | order(surname asc){
        _id,
        firstName,
        surname
      },
      "documents": *[_id == "siteSettings" && !(_id in path("drafts.**"))][0].governanceResources[] {
        _key,
        groupTitle,
        resources[] {
          _key,
          name,
          url,
          "file": file.asset->url,
          fileOrLink 
        } 
		  } 
    }`
  );
  return {
    props: {
      officers: data.officers,
      committees: data.committees,
      vicePresidents: data.vicePresidents,
      trustees: data.trustees,
      documents: data.documents,
    },
    revalidate: 3600,
  };
};
