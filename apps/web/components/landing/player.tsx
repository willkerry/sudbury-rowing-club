import { useState } from "react";
import YouTube from "react-youtube";
import { Dialog, Transition } from "@headlessui/react";
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
        className="absolute bottom-3 right-3 text-white sm:bottom-7 sm:right-7"
      >
        <PlayIcon className="h-8 w-8 md:h-10 md:w-10" />
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
          <div className="flex h-full w-full items-center justify-center p-2 sm:p-10 md:p-20 lg:p-40 xl:p-60">
            <YouTube
              videoId={youTubeId}
              opts={options(youTubeStart)}
              className="aspect-h-9 aspect-w-16 z-50 w-full overflow-hidden rounded-lg bg-white shadow-xl"
            />
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Player;
