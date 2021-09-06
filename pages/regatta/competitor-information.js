import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import CompetitorInformation from "@/components/regatta/competitor-information";
import { BASE_URL } from "@/lib/constants";
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
