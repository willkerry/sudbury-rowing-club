import Image from "next/image";
import dynamic from "next/dynamic";
import { urlFor } from "@/lib/sanity";
import BoathouseDoor from "@/components/landing/boathouse-door";

const Player = dynamic(() => import("@/components/landing/player"));

type Props = {
  imageId: string;
  imageAspectRatio: number;
  imageLqip: string;
  slogan: string;
  youTubeId: string;
  youTubeStart: number;
};

const LandingHero = ({
  imageId,
  imageAspectRatio,
  imageLqip,
  slogan,
  youTubeId,
  youTubeStart,
}: Props) => (
  <div className="container max-w-screen-lg md:mx-auto md:px-5">
    <div className="relative flex overflow-hidden shadow-lg md:rounded-xl group">
      <Image
        src={urlFor(imageId).url()}
        width={984}
        height={984 / imageAspectRatio}
        alt="Aerial photograph of a Sudbury crew training."
        quality={30}
        placeholder="blur"
        blurDataURL={imageLqip}
        priority
      />
      <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full gap-3 p-6 sm:gap-8 md:gap-12 lg:gap-14 sm:p-12 md:p-24">
        <BoathouseDoor className="w-full text-white" />
        <span className="px-1 md:px-3 py-0.5 md:py-1 text-xs sm:text-sm md:text-base font-medium bg-white rounded-full">
          <span className="text-transparent to-yellow-700 bg-gradient-to-r from-blue-800 via-green-700 bg-clip-text">
            {slogan}
          </span>
        </span>
      </div>
      <Player youTubeId={youTubeId} youTubeStart={youTubeStart} />
    </div>
  </div>
);
export default LandingHero;
