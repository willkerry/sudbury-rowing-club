import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import YouTube from "react-youtube";

type Props = {
  youTubeId: string;
  youTubeStart: number;
};
const Player = ({ youTubeId, youTubeStart }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        title="Open video"
        className="absolute text-white bottom-3 right-3 sm:bottom-7 sm:right-7"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-10 h-10 md:w-8 md:h-8"
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
      </button>

      <Transition
        show={isOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 z-40 overflow-y-auto"
        >
          <Dialog.Overlay className="absolute inset-0 bg-black opacity-70 backdrop-blur" />

          <div className="flex items-center justify-center w-full h-full p-2 sm:p-10 md:p-20 lg:p-40 xl:p-60">
            <YouTube
              videoId={youTubeId}
              opts={{
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  modestbranding: 1,
                  start: youTubeStart,
                },
              }}
              iframeClassName="w-full aspect-w-16 aspect-h-9"
              className="z-50 bg-white rounded-lg shadow-xl"
            />
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Player;
