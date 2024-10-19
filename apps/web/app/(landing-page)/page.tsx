import { HundredAndFiftyCta } from "@/components/anniversary/150-cta";
import Introduction from "@/components/landing/introduction";
import LatestNews from "@/components/landing/latest-news";
import Container from "@/components/layouts/container";
import { ClubJsonLd } from "@/lib/constants";
import { fetchLandingPage } from "@sudburyrc/api";
import dynamic from "next/dynamic";

const Note = dynamic(() => import("@/components/stour/note"));
const Gallery = dynamic(
  () => import("@/components/regatta/landing-page/gallery"),
);
const LandingCTA = dynamic(() => import("@/components/landing/cta"));
const LandingHero = dynamic(() => import("@/components/landing/landing-hero"));

export const generateMetadata = async () => {
  const {
    landingPage: { tagline, title },
  } = await fetchLandingPage();

  return {
    title,
    description: tagline,
  };
};

const Home = async () => {
  const {
    news,
    landingPage: { description, heroImage, images, note, tagline },
  } = await fetchLandingPage();

  return (
    <>
      {note.display && (
        <Container>
          <Note centered label={note.label} type={note.type}>
            {note.text}
          </Note>
        </Container>
      )}
      <LandingHero
        slogan={tagline}
        imageId={heroImage.image._id}
        imageAspectRatio={heroImage.image.aspectRatio}
        imageLqip={heroImage.image.lqip}
      />
      <LandingCTA />
      <Introduction description={description} />

      <div className="mx-auto max-w-7xl px-4 pb-20">
        <HundredAndFiftyCta />
      </div>

      <Gallery images={images} />
      <LatestNews news={news} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ClubJsonLd) }}
      />
    </>
  );
};

export default Home;
