import {
  Committees,
  Documents,
  NonExec,
  Officers,
} from "@/components/governance";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import HeroTitle from "@/components/stour/hero/hero-title";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";
import {
  Committee,
  DocumentGroup,
  NonExecutiveOfficer,
  Officer,
} from "@/types/governance";
import groq from "groq";
import { NextSeo } from "next-seo";

type Props = {
  officers: Officer[];
  vicePresidents: NonExecutiveOfficer[];
  trustees: NonExecutiveOfficer[];
  committees: Committee[];
  documents: DocumentGroup[];
};

const Governance = ({
  officers,
  committees,
  vicePresidents,
  trustees,
  documents,
}: Props) => (
  <Layout>
    <NextSeo
      openGraph={{
        images: [{ url: `${BASE_URL}/assets/og/goverance.png` }],
        title: "Governance",
      }}
      title="Governance"
    />
    <HeroTitle prose title="Governance" />
    <Container className="my-16">
      <Officers officers={officers} />
      <Committees committees={committees} />
      <NonExec trustees={trustees} vicePresidents={vicePresidents} />
      <Documents documents={documents} />
    </Container>
  </Layout>
);

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
      committees: data.committees,
      documents: data.documents,
      officers: data.officers,
      trustees: data.trustees,
      vicePresidents: data.vicePresidents,
    },
  };
};

export default Governance;
