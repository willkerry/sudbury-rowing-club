import { Gallery } from "@/components/regatta/landing-page/gallery";
import { fetchLandingPage } from "@sudburyrc/api";

const LandingGalleryPage = async () => {
  const {
    landingPage: { images },
  } = await fetchLandingPage();

  return <Gallery images={images} />;
};

export default LandingGalleryPage;
