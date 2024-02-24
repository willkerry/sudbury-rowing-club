import { NextPage } from "next";
import { NextSeo } from "next-seo";
import groq from "groq";
import { sanityClient } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import CompetitorInformation from "@/components/regatta/competitor-information";
import HeroTitle from "@/components/stour/hero/hero-title";

export type CompetitorInformationType = {
  description: string;
  documents: {
    _id: string;
    title: string;
    extension: string;
    url: string;
  }[];
};

const CompetitorInformationPage: NextPage<CompetitorInformationType> = ({
  description,
  documents,
}) => (
  <Layout>
    <NextSeo
      title="Competitor Information | Sudbury Regatta"
      description="Essential information for competitors at the Sudbury Regatta."
      openGraph={{
        title: "Competitor Information",
        description:
          "Essential information for competitors at the Sudbury Regatta.",
        images: [{ url: makeShareImageURL("Competitor Information", true) }],
      }}
    />
    <HeroTitle title="Competitor Information" breadcrumbs />
    <Container className="py-16">
      <CompetitorInformation {...{ description }} items={documents} />
    </Container>
  </Layout>
);

export default CompetitorInformationPage;

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(groq`
  *[_type == "regattaSettings"][0]{
    competitorInformation { 
      description, 
      documents[] { 
        title, 
        "extension": asset->extension, 
        "url": asset->url, 
        "_id": asset->_id
      },
    },
  }`);
  return {
    props: data.competitorInformation,
  };
};
