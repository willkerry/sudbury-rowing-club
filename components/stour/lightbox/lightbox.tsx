import { Dialog, Transition } from "@headlessui/react";
import { useToggle, useViewportSize } from "@mantine/hooks";
import { Fragment, SetStateAction } from "react";

type LightBoxProps = {
  aspectRatio: number;
  src: string;
  lqip: string;
  alt: string;
  open: boolean;
  toggle: (value?: SetStateAction<boolean>) => void;
};

const LightBox = ({
  aspectRatio,
  src,
  lqip,
  alt,
  open,
  toggle,
}: LightBoxProps) => {
  const { width, height, viewportWidth, viewportHeight } =
    useLightBoxSize(aspectRatio);

  return (
    <>
      <Transition
        show={open}
        enter="transition"
        enterFrom="transform scale-50 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-50 opacity-0"
        as={Fragment}
      >
        <Dialog
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur cursor-zoom-out"
          open={open}
          onClose={() => toggle()}
          onClick={() => toggle()}
        >
          <img
            {...{ alt, width, height, src }}
            className="rounded shadow-lg"
            style={{
              maxWidth: viewportWidth,
              maxHeight: viewportHeight,
              backgroundImage: `url(${lqip})`,
              backgroundSize: "cover",
            }}
          />
        </Dialog>
      </Transition>
    </>
  );
};

const useLightBox = ({
  aspectRatio,
  src,
  lqip,
  alt,
}: Omit<LightBoxProps, "open" | "toggle">) => {
  const [isOpen, toggle] = useToggle();

  return {
    toggle,
    LightBox: () => (
      <LightBox {...{ aspectRatio, src, lqip, alt, open: isOpen, toggle }} />
    ),
  };
};

export default LightBox;
export { useLightBox };

function calculateImageSize(
  windowWidth: number,
  windowHeight: number,
  aspectRatio: number
) {
  const windowAspectRatio = windowWidth / windowHeight;

  if (windowAspectRatio > aspectRatio) {
    return {
      width: (windowHeight - 32) * aspectRatio,
      height: windowHeight - 32,
    };
  }

  return {
    width: windowWidth - 32,
    height: (windowWidth - 32) / aspectRatio,
  };
}

function useLightBoxSize(aspectRatio: number) {
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();

  const { width, height } = calculateImageSize(
    viewportWidth,
    viewportHeight,
    aspectRatio
  );

  return { width, height, viewportWidth, viewportHeight };
}
