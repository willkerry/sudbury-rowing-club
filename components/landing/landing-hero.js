import Image from "next/image";
import DroneImage from "../../public/assets/landing/drone.jpg";
import BoathouseDoor from "@/components/landing/boathouse-door";
import Player from "@/components/landing/player";
import Button from "@/components/stour/button";
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

        <div className="absolute top-0 flex items-center w-full h-full p-24">
          <div className="flex flex-col justify-center w-full space-y-6">
            <BoathouseDoor className="w-full text-white" />
            <div>
              <span className="px-3 py-1 font-medium bg-white rounded-full">
                {props.slogan}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute text-white bottom-4 right-4">
          <PlayIcon className="w-16 h-16 transition group-hover:transform group-hover:scale-105" />
        </div>
      </div>
      <div className="flex items-center justify-center pt-16 space-x-3 text-white">
        <Button label="Discover more" shadow size="large" />
        <Button label="Join us" variant="secondary" shadow size="large" />
      </div>
    </Player>
  );
}
export default LandingHero;
