import Image from "next/image";
import dynamic from "next/dynamic";
import { urlFor } from "@sudburyrc/api";
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
    <div className="group relative flex overflow-hidden shadow-lg md:rounded-xl">
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
      <div className="absolute top-0 flex h-full w-full flex-col items-center justify-center gap-3 p-6 sm:gap-8 sm:p-12 md:gap-12 md:p-24 lg:gap-14">
        <BoathouseDoor className="w-full text-white" />
        <span className="rounded-full bg-white px-1 py-0.5 text-xs font-medium sm:text-sm md:px-3 md:py-1 md:text-base">
          <span className="bg-gradient-to-r from-blue-800 via-green-700 to-yellow-700 bg-clip-text text-transparent">
            {slogan}
          </span>
        </span>
      </div>
      <Player youTubeId={youTubeId} youTubeStart={youTubeStart} />
    </div>
  </div>
);
export default LandingHero;
