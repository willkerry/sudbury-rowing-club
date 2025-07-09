import { fetchLandingPage } from "@sudburyrc/api";
import Script from "next/script";
import { ClubJsonLd } from "@/lib/constants";

export const generateMetadata = async () => {
  const {
    landingPage: { tagline, title },
  } = await fetchLandingPage();

  return {
    title,
    description: tagline,
  };
};

const Home = async () => (
  <Script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(ClubJsonLd) }}
  />
);

export default Home;
