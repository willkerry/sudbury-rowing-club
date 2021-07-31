import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlayCircle } from "react-feather";
import { PlayIcon } from "@heroicons/react/solid";

function Player(props) {
  let [isOpen, setIsOpen] = useState(false);
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
              <div className="w-full aspect-w-16 aspect-h-9">
                <iframe
                  className="bg-white rounded-lg shadow-xl z-2"
                  src={props.youTubeEmbedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullCcreen
                />
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
export default Player;
