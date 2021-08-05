import Image from "next/image";
import DroneImage from "../../public/assets/landing/drone.jpg";
import BoathouseDoor from "@/components/landing/boathouse-door";
import Player from "@/components/landing/player";
import { PlayIcon } from "@heroicons/react/solid";

function LandingHero(props) {
  return (
    <Player youTubeId={props.youTubeId} youTubeStart={props.youTubeStart}>
      <div className="relative flex shadow-lg rounded-2xl group">
        <Image
          src={DroneImage}
          alt="Aerial photograph of a Sudbury crew training."
          className="rounded-2xl"
          placeholder="blur"
        />
        <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full gap-2 p-6 md:gap-6 sm:p-12 md:p-24">
          <BoathouseDoor className="w-full text-white drop-shadow" />
          <div>
            <span className="px-1 md:px-3 py-0.5 md:py-1 text-xs sm:text-sm md:text-base font-medium bg-white rounded-full drop-shadow">
              {props.slogan}
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
