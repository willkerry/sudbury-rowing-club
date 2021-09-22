import Image from "next/image";
import BoathouseDoor from "@/components/landing/boathouse-door";
import Player from "@/components/landing/player";
import { urlFor } from "@/lib/sanity";

function LandingHero(props) {
  return (
    <div className="relative flex overflow-hidden shadow-lg md:rounded-xl group">
      {/* The  image is a static import – Next.js auto-populates its width and height. */}

      <Image
        src={urlFor(props.imageId).url()}
        width={984}
        height={984 / props.imageAspectRatio}
        alt="Aerial photograph of a Sudbury crew training."
        placeholder="blur"
        blurDataURL={props.imageLqip}
      />

      {/* All the text/body content is inside an absolute container on top of the container. */}

      <div className="absolute top-0 flex flex-col items-center justify-center w-full h-full gap-3 p-6 sm:gap-8 md:gap-12 lg:gap-14 sm:p-12 md:p-24">
        <BoathouseDoor className="w-full text-white" />
        <div>
          <span className="px-1 md:px-3 py-0.5 md:py-1 text-xs sm:text-sm md:text-base font-medium bg-white rounded-full">
            <span className="text-transparent to-yellow-700 bg-gradient-to-r from-blue-800 via-green-700 bg-clip-text">
              {props.slogan}
            </span>
          </span>
        </div>
      </div>

      {/* The  player component is triggered from this absolutely positioned play icon. */}

      <Player youTubeId={props.youTubeId} youTubeStart={props.youTubeStart}>
        <div className="absolute text-white bottom-3 right-3 sm:bottom-7 sm:right-7">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 md:w-8 md:h-8"
          >
            <circle
              cx="12"
              cy="12"
              r="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />

            <path
              fill="currentColor"
              d="M8.5 16.2V7.9c0-.6.7-1 1.2-.7l6.7 4.1a.8.8 0 0 1 0 1.4l-6.8 4.1a.8.8 0 0 1-1.1-.6Z"
            />
          </svg>
        </div>
      </Player>
    </div>
  );
}
export default LandingHero;
