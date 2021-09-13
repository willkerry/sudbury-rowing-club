import Image from "next/image";
import DroneImage from "../../public/assets/landing/drone.jpg";
import BoathouseDoor from "@/components/landing/boathouse-door";
import Player from "@/components/landing/player";
import { PlayIcon } from "@heroicons/react/solid";

function LandingHero(props) {
  return (
    <Player youTubeId={props.youTubeId} youTubeStart={props.youTubeStart}>
      <div className="relative flex overflow-hidden shadow-lg rounded-xl group">
        <Image
          src={DroneImage}
          alt="Aerial photograph of a Sudbury crew training."
          className="rounded-xl"
          placeholder="blur"
        />
        <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full gap-3 p-6 sm:gap-8 md:gap-12 lg:gap-14 sm:p-12 md:p-24">
          <BoathouseDoor className="w-full text-white drop-shadow" />
          <div>
            <span className="px-1 md:px-3 py-0.5 md:py-1 text-xs sm:text-sm md:text-base font-medium bg-white rounded-full drop-shadow-lg">
              <span className="text-transparent bg-yellow-700 bg-gradient-to-r from-blue-800 via-green-700 to bg-clip-text">{props.slogan}</span>
            </span>
          </div>
        </div>
        <div className="absolute text-white bottom-1 right-1 sm:bottom-4 sm:right-4">
          <PlayIcon className="w-8 h-8 transition md:w-16 md:h-16 group-hover:transform group-hover:scale-110 filter drop-shadow" />
        </div>
      </div>
    </Player>
  );
}
export default LandingHero;
