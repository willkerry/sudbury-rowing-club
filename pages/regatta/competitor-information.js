import Layout from "@/components/layout";
import HeroTitle from "@/components/hero-title";
import Container from "@/components/container";
import CompetitorInformation from "@/components/regatta/competitor-information";
import { NextSeo } from "next-seo";

export default function CompetitorInformationPage() {
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
        <CompetitorInformation />
      </Container>
    </Layout>
  );
}
