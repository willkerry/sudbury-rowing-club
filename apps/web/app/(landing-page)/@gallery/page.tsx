import { fetchLandingPage } from "@sudburyrc/api";
import { Gallery } from "@/components/regatta/landing-page/gallery";

const LandingGalleryPage = async () => {
  const {
    landingPage: { images },
  } = await fetchLandingPage();

  return <Gallery images={images} />;
};

export default LandingGalleryPage;
