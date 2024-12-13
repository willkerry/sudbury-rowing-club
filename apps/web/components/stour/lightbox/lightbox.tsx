"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useToggle, useViewportSize } from "@mantine/hooks";
import { Fragment, type SetStateAction } from "react";

type LightBoxProps = {
  aspectRatio?: number;
  src: string;
  lqip?: string;
  alt?: string;
  open: boolean;
  toggle: (value?: SetStateAction<boolean>) => void;
};

const PADDING = 16;

function calculateImageSize(
  windowWidth: number,
  windowHeight: number,
  aspectRatio = 1,
) {
  const windowAspectRatio = windowWidth / windowHeight;

  if (windowAspectRatio > aspectRatio) {
    return {
      width: (windowHeight - PADDING * 2) * aspectRatio,
      height: windowHeight - PADDING * 2,
    };
  }

  return {
    width: windowWidth - PADDING * 2,
    height: (windowWidth - PADDING * 2) / aspectRatio,
  };
}

function useLightBoxSize(aspectRatio?: number) {
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();

  const { width, height } = calculateImageSize(
    viewportWidth,
    viewportHeight,
    aspectRatio,
  );

  return { width, height, viewportWidth, viewportHeight };
}

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
        className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-white bg-opacity-10 backdrop-blur"
        open={open}
        onClose={() => toggle()}
        onClick={() => toggle()}
      >
        <img
          alt={alt}
          width={width}
          height={height}
          src={src}
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
