import { BoathouseDoor } from "./boathouse-door";
import { LandingHeroImage } from "./landing-hero-image";
import Player from "./player";

type Props = {
  imageId: string;
  imageAspectRatio: number;
  imageLqip: string;
  description: string;
};

export const LandingHero = ({
  imageId,
  imageAspectRatio,
  imageLqip,
  description,
}: Props) => (
  <div className="group relative flex overflow-hidden rounded-sm shadow-sm">
    <LandingHeroImage
      imageId={imageId}
      imageAspectRatio={imageAspectRatio}
      imageLqip={imageLqip}
    />
    <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center gap-3 p-6 sm:gap-8 sm:p-12 md:gap-12 md:p-24 lg:gap-14">
      <BoathouseDoor aria-hidden className="z-10 w-full text-white" />
      <span className="z-10 rounded-full bg-white px-1 py-0.5 font-medium text-black text-xs mix-blend-screen shadow-sm backdrop-blur-sm sm:text-sm md:px-3 md:py-1 md:text-base">
        {description}
      </span>
    </div>
    <Player />
  </div>
);
