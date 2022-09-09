import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import YouTube from "react-youtube";
import { PlayIcon } from "@heroicons/react/20/solid";

type Props = {
  youTubeId: string;
  youTubeStart: number;
};

const options = (startTime: number) => ({
  playerVars: {
    autoplay: 1,
    controls: 0,
    modestbranding: 1,
    start: startTime,
    mute: 1,
  },
});

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
        <PlayIcon className="w-8 h-8 md:w-10 md:h-10" />
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
              opts={options(youTubeStart)}
              className="z-50 w-full overflow-hidden bg-white rounded-lg shadow-xl aspect-w-16 aspect-h-9"
            />
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Player;
