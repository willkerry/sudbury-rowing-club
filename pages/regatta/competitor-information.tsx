import groq from "groq";
import { NextSeo } from "next-seo";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import CompetitorInformation from "@/components/regatta/competitor-information";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";

type Props = {
  description: string;
  documents: {
    _id: string;
    title: string;
    extension: string;
    url: string;
  }[];
};

const CompetitorInformationPage = (props: Props) => (
  <Layout>
    <NextSeo
      title="Competitor Information | Sudbury Regatta"
      description="Essential information for competitors at the Sudbury Regatta."
      openGraph={{
        title: "Competitor Information",
        description:
          "Essential information for competitors at the Sudbury Regatta.",
        images: [{ url: `${BASE_URL}/assets/og/competitor-information.png` }],
      }}
    />
    <HeroTitle title="Competitor Information" breadcrumbs />
    <Container className="py-16">
      <CompetitorInformation
        description={props.description}
        items={props.documents}
      />
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
