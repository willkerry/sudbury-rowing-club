import Image from "next/image";
import DroneImage from "../../public/assets/landing/drone.jpg";
import BoathouseDoor from "@/components/landing/boathouse-door";
import Player from "@/components/landing/player";
import { PlayIcon } from "@heroicons/react/outline";
import { Play } from "react-feather";

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
              <span className="text-transparent bg-yellow-700 bg-gradient-to-r from-blue-800 via-green-700 to bg-clip-text">
                {props.slogan}
              </span>
            </span>
          </div>
        </div>
        <div className="absolute text-white bottom-1 right-1 sm:bottom-4 sm:right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-12 h-12"
          >
            <circle
              cx="12"
              cy="12"
              r="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />

            <path
              fill="currentColor"
              className="transition duration-200 origin-center group-hover:scale-105"
              d="M8.5 16.2V7.9c0-.6.7-1 1.2-.7l6.7 4.1a.8.8 0 0 1 0 1.4l-6.8 4.1a.8.8 0 0 1-1.1-.6Z"
            />
          </svg>
        </div>
      </div>
    </Player>
  );
}
export default LandingHero;
