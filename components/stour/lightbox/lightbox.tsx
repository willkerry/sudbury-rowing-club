import { Dialog, Transition } from "@headlessui/react";
import { useElementSize } from "@mantine/hooks";
import { Fragment, SetStateAction } from "react";

type LightBoxProps = {
  aspectRatio: number;
  src: string;
  lqip: string;
  alt: string;
  open: boolean;
  toggle: (value?: SetStateAction<boolean> | undefined) => void;
};

const LightBox = ({
  aspectRatio,
  src,
  lqip,
  alt,
  open,
  toggle,
}: LightBoxProps) => {
  const { ref, width: elementWidth, height: elementHeight } = useElementSize();

  const height = elementHeight - 32;
  const width = height * aspectRatio;

  return (
    <>
      <div ref={ref} className="fixed inset-0 -z-50" />
      <Transition
        show={open}
        enter="transition"
        enterFrom="transform scale-75 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-75 opacity-0"
        as={Fragment}
      >
        <Dialog
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 cursor-zoom-out"
          open={open}
          onClose={() => toggle()}
          onClick={() => toggle()}
        >
          <img
            {...{ alt, width, height, src }}
            className="rounded-lg shadow"
            style={{
              maxWidth: elementWidth,
              maxHeight: elementHeight,
              backgroundImage: `url(${lqip})`,
              backgroundSize: "cover",
            }}
          />
        </Dialog>
      </Transition>
    </>
  );
};

export default LightBox;
