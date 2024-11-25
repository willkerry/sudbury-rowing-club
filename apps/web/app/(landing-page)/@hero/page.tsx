import { fetchLandingPage } from "@sudburyrc/api";
import LandingHero from "@/components/landing/landing-hero";
import BoathouseDoor from "@/components/landing/boathouse-door";

const LandingHeroPage = async () => {
  const {
    landingPage: { tagline, heroImage },
  } = await fetchLandingPage();

  return (
    <div className="group relative flex overflow-hidden rounded shadow">
      <LandingHero
        imageId={heroImage.image._id}
        imageAspectRatio={heroImage.image.aspectRatio}
        imageLqip={heroImage.image.lqip}
      >
        <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center gap-3 p-6 sm:gap-8 sm:p-12 md:gap-12 md:p-24 lg:gap-14">
          <BoathouseDoor aria-hidden className="z-10 w-full text-white" />
          <span className="z-10 rounded-full bg-white px-1 py-0.5 text-xs font-medium text-black mix-blend-screen shadow backdrop-blur sm:text-sm md:px-3 md:py-1 md:text-base">
            {tagline}
          </span>
        </div>
      </LandingHero>
    </div>
  );
};

export default LandingHeroPage;