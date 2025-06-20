import Container from "@/components/layouts/container";
import CompetitorInformation from "@/components/regatta/competitor-information";
import HeroTitle from "@/components/stour/hero/hero-title";
import { createMetadata } from "@/lib/create-metadata";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";

export const metadata = createMetadata({
  title: "Competitor Information | Sudbury Regatta",
  description: "Essential information for competitors at the Sudbury Regatta.",
  image: { title: "Competitor Information" },
});

export type CompetitorInformationType = {
  description: string;
  documents: {
    _id: string;
    title: string;
    extension: string;
    url: string;
  }[];
};

const CompetitorInformationPage = async () => {
  const {
    competitorInformation: { description, documents },
  }: {
    competitorInformation: CompetitorInformationType;
  } = await sanityClient.fetch(groq`
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

  return (
    <>
      <HeroTitle title="Competitor information" breadcrumbs />
      <Container className="pb-16">
        <CompetitorInformation description={description} items={documents} />
      </Container>
    </>
  );
};

export default CompetitorInformationPage;
