import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import CompetitorInformation from "@/components/regatta/competitor-information";
import { BASE_URL } from "@/lib/constants";
import { NextSeo } from "next-seo";
import { sanityClient } from "@/lib/sanity.server";
import groq from "groq";

export default function CompetitorInformationPage({ data }) {
  return (
    <Layout>
      <NextSeo
        title="Competitor Information | Sudbury Regatta"
        description="Essential information for competitors at the Sudbury Regatta."
        openGraph={{
          title: "Competitor Information",
          description:
            "Essential information for competitors at the Sudbury Regatta.",
          images: [{ url: BASE_URL + "/assets/og/competitor-information.png" }],
        }}
      />
      <HeroTitle title="Competitor Information" breadcrumbs />
      <Container className="py-16">
        <CompetitorInformation
          description={data.description}
          items={data.documents}
        />
      </Container>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(groq`
  *[_type == "regattaSettings"][0]{
    competitorInformation 
      { 
      description, 
      documents[] 
        { 
        title, 
        "extension": asset->extension, 
        "url": asset->url, 
        "_id": asset->_id
        },
      },
    } 
  `);
  return {
    props: { data: data.competitorInformation },
    revalidate: 7200,
  };
};
