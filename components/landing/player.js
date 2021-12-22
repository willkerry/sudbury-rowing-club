import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";

const YouTube = dynamic(() => import("react-youtube"));

export default function Player({ youTubeId, youTubeStart, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const opts = {
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      start: youTubeStart,
    },
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        title="Open video"
      >
        {children}
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
          <Dialog.Overlay className="fixed inset-0 z-0 bg-black opacity-60" />

          <div className="flex items-center justify-center w-full h-full p-2 sm:p-10 md:p-20 lg:p-40 xl:p-60">
            <YouTube
              videoId={youTubeId}
              opts={opts}
              containerClassName="w-full aspect-w-16 aspect-h-9"
              className="bg-white rounded-lg shadow-xl z-2"
            />
            <button />
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
Player.propTypes = {
  youTubeId: PropTypes.string.isRequired,
  youTubeStart: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};
