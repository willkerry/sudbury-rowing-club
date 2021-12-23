import { Popover, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import cn from "classnames";
import { NextSeo } from "next-seo";
import { HelpCircle, Image as ImageIcon, XCircle } from "react-feather";
import { Link as ScrollLink } from "react-scroll";
import groq from "groq";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Link from "@/components/stour/link";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";

const propTypesClassNameChildren = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function GovGrid({ children }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
      {children}
    </div>
  );
}

GovGrid.propTypes = {
  children: PropTypes.node.isRequired,
};

function StyledScrollLink({ to }) {
  return (
    <ScrollLink
      activeClass="text-gray-900 bg-gray-100"
      className="block px-2 py-2 my-0.5 mr-4 -mx-2 transition rounded-md whitespace-nowrap hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
      spy
      smooth
      offset={-100}
      duration={200}
      to={to}
    />
  );
}

StyledScrollLink.propTypes = {
  to: PropTypes.string.isRequired,
};

function ScrollComponent({ items }) {
  return (
    <div className="bg-white border-b">
      <div className="container flex flex-wrap items-center max-w-screen-lg px-5 py-2 mx-auto overflow-hidden text-xs font-medium tracking-wide text-gray-500 uppercase sm:h-16 sm:font-normal sm:tracking-normal sm:normal-case sm:text-base">
        {items.map((item) => (
          <StyledScrollLink key={item.to} to={item.to}>
            {item.name}
          </StyledScrollLink>
        ))}
      </div>
    </div>
  );
}
ScrollComponent.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function SectionTitle({ className, children }) {
  return (
    <h2
      className={cn(
        "mt-16 mb-6 text-2xl font-bold tracking-tight text-gray-800",
        className
      )}
    >
      {children}
    </h2>
  );
}

SectionTitle.propTypes = propTypesClassNameChildren;
SectionTitle.defaultProps = {
  className: null,
};

function SubTitle({ className, children }) {
  return (
    <h3 className={cn("mb-0.5 font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
}

SubTitle.propTypes = propTypesClassNameChildren;
SubTitle.defaultProps = {
  className: null,
};
function OfficerName({ children }) {
  return (
    <div className="font-semibold text-gray-800 tracking-snug">{children}</div>
  );
}
OfficerName.propTypes = {
  children: PropTypes.node.isRequired,
};

function Description({ children, className }) {
  return <div className={cn("text-gray-700", className)}>{children}</div>;
}
Description.propTypes = propTypesClassNameChildren;
Description.defaultProps = {
  className: null,
};

function Spacer() {
  return <div className="h-4" />;
}
function DashUl({ children }) {
  return <ul className="">{children}</ul>;
}

DashUl.propTypes = {
  children: PropTypes.node.isRequired,
};

function DashLiFirst({ children }) {
  return (
    <li className="relative mb-3 ml-4 text-gray-800 first:before:text-gray-400 committee-member">
      {children}
      <style jsx>{`
        .committee-member:first-child::before {
          writing-mode: vertical-rl;
          font-weight: 600;
          content: "Chair";
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-size: 0.5rem;
          line-height: 1;
          position: absolute;
          left: -1rem;
          top: 0.3rem;
        }
      `}</style>
    </li>
  );
}
DashLiFirst.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Governance({
  officers,
  committees,
  vicePresidents,
  trustees,
  documents,
}) {
  return (
    <Layout>
      <NextSeo
        title="Governance"
        openGraph={{
          title: "Governance",
          images: [{ url: `${BASE_URL}/assets/og/goverance.png` }],
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
            {officers.map((officer) => (
              <div key={officer._id}>
                <div className="relative flex items-center justify-center w-full mb-2 overflow-hidden rounded h-36 bg-gradient-to-b from-gray-200 to-gray-100">
                  {officer.vacant ? (
                    <div className="font-bold tracking-widest text-gray-400 uppercase">
                      TBA
                    </div>
                  ) : (
                    <ImageIcon className="text-gray-400" />
                  )}
                  {officer.description && (
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
                            <p>{officer.description}</p>
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
                  )}
                </div>
                <OfficerName>
                  {officer.vacant ? <>&nbsp;</> : officer.name}
                </OfficerName>
                <Description>{officer.role}</Description>
              </div>
            ))}
          </GovGrid>
          <p className="py-12 text-sm text-gray-500">
            The role descriptions provided above are abbreviated and for
            illustrative purposes only. Please refer to the{" "}
            <Link href="/governance/constitution">constitution</Link> for
            accurate details. If you wish to enquire about a vacant position,
            please contact the club secretary.
          </p>
        </section>
        <section id="committees">
          <SectionTitle>Committees</SectionTitle>

          <GovGrid>
            {committees.map((committee) => (
              <div key={committee._id}>
                <SubTitle>{committee.title}</SubTitle>
                <Description>{committee.description}</Description>
                <Spacer />
                <DashUl>
                  {committee.members !== null &&
                    committee.members.map((member) => (
                      <DashLiFirst key={member._id}>
                        <div className="text-sm font-medium text-gray-700">
                          {member.role}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.name}
                        </div>
                      </DashLiFirst>
                    ))}
                </DashUl>
              </div>
            ))}
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
                  vicePresidents.map((vicePresident) => (
                    <li key={vicePresident._id}>
                      {vicePresident.firstName} {vicePresident.surname}
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <SubTitle>Trustees</SubTitle>
              <ul className="text-sm text-gray-600">
                {trustees !== null &&
                  trustees.map((trustee) => (
                    <li key={trustee._id}>
                      {trustee.firstName} {trustee.surname}
                    </li>
                  ))}
              </ul>
            </div>
          </GovGrid>
        </section>

        <section id="documents" className="py-12">
          <SectionTitle>Documents</SectionTitle>
          {documents.map((group) => (
            <div key={group._key} className="mt-6">
              <SubTitle>{group.groupTitle}</SubTitle>
              <ul className="space-y-1">
                {group.resources.map((doc) => (
                  <li key={doc._key}>
                    <Link
                      href={doc.url ? doc.url : `${doc.file}?dl=`}
                      download={doc.fileOrLink === "Upload a file"}
                      external={
                        doc.fileOrLink === "Enter a link" &&
                        !doc.url.includes(BASE_URL) &&
                        doc.url.includes("http")
                      }
                    >
                      {doc.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </Container>
    </Layout>
  );
}

Governance.propTypes = {
  officers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      role: PropTypes.string,
      vacant: PropTypes.bool,
      description: PropTypes.string,
    })
  ),
  vicePresidents: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string,
      surname: PropTypes.string,
      role: PropTypes.string,
    })
  ),
  trustees: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      firstName: PropTypes.string,
      surname: PropTypes.string,
      role: PropTypes.string,
    })
  ),
  committees: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      members: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          name: PropTypes.string,
          role: PropTypes.string,
        })
      ),
    })
  ),
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      _key: PropTypes.string,
      groupTitle: PropTypes.string,
      resources: PropTypes.arrayOf(
        PropTypes.shape({
          _key: PropTypes.string,
          name: PropTypes.string,
          fileOrLink: PropTypes.string,
          url: PropTypes.string,
          file: PropTypes.string,
        })
      ),
    })
  ),
};

Governance.defaultProps = {
  officers: [],
  vicePresidents: [],
  trustees: [],
  committees: [],
  documents: [],
};

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`{
      "officers": *[_type == "officers" && !(_id in path("drafts.**"))] | order(order asc){
        _id,
        name,
        role,
        vacant,
        description,
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
    revalidate: 7200,
  };
};
