import { fetchLandingPage } from "@sudburyrc/api";
import { BoathouseDoor } from "@/components/landing/boathouse-door";
import { LandingHero } from "@/components/landing/landing-hero";

const LandingHeroPage = async () => {
  const {
    landingPage: { tagline, heroImage },
  } = await fetchLandingPage();

  return (
    <div className="group relative flex overflow-hidden rounded-sm shadow-sm">
      <LandingHero
        imageId={heroImage._id}
        imageAspectRatio={heroImage.aspectRatio}
        imageLqip={heroImage.lqip}
      >
        <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center gap-3 p-6 sm:gap-8 sm:p-12 md:gap-12 md:p-24 lg:gap-14">
          <BoathouseDoor aria-hidden className="z-10 w-full text-white" />
          <span className="z-10 rounded-full bg-white px-1 py-0.5 font-medium text-black text-xs mix-blend-screen shadow-sm backdrop-blur-sm sm:text-sm md:px-3 md:py-1 md:text-base">
            {tagline}
          </span>
        </div>
      </LandingHero>
    </div>
  );
};

export default LandingHeroPage;
