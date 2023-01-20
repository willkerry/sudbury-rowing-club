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
import { urlFor } from "@/lib/sanity";
import sanityClient from "@/lib/sanity.server";
import {
  Committee,
  DocumentGroup,
  NonExecutiveOfficer,
  Officer,
} from "@/types/governance";
import groq from "groq";
import { InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";

export const getStaticProps = async () => {
  const data = await sanityClient.fetch<{
    officers: Officer[];
    committees: Committee[];
    vicePresidents: NonExecutiveOfficer[];
    trustees: NonExecutiveOfficer[];
    documents: DocumentGroup[];
  }>(
    groq`{
      "officers": *[_type == "officers" && !(_id in path("drafts.**"))] | order(orderRank){
        _id,
        name,
        role,
        vacant,
        description,
        "hasEmail": email != null,
        "image": image.image {
          "_id": asset->_id,
          "lqip": asset->metadata.lqip,
        }
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

  data.officers.forEach((officer) => {
    if (officer.image) {
      officer.image.url = urlFor(officer.image._id)
        .crop("entropy")
        .fit("clip")
        .size(500, 500)
        .sharpen(30)
        .url();
    }
  });

  return {
    props: data,
  };
};

const Governance: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  officers,
  committees,
  vicePresidents,
  trustees,
  documents,
}) => (
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

export default Governance;
