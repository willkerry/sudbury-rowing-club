import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import YouTube from "react-youtube";

function Player(props) {
  let [isOpen, setIsOpen] = useState(false);
  const videoId = props.youTubeId;
  const opts = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      start: props.youTubeStart,
    },
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} title="Open video">
        {props.children}
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
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex justify-center">
            <Dialog.Overlay className="fixed inset-0 z-0 bg-black opacity-60" />
            <div className="flex items-center w-screen h-screen p-48">
              <YouTube
                videoId={videoId}
                opts={opts}
                containerClassName="w-full aspect-w-16 aspect-h-9"
                className="bg-white rounded-lg shadow-xl z-2"
              />
              <button />
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
export default Player;
