"use client";

import { Dialog, Transition } from "@headlessui/react";
import { useReducedMotion, useToggle, useViewportSize } from "@mantine/hooks";
import { type ComponentProps, createContext, Fragment, use } from "react";

type LightBoxContextValue = {
  toggle: () => void;
};

const LightBoxContext = createContext<LightBoxContextValue | null>(null);

const useLightBoxContext = () => {
  const context = use(LightBoxContext);
  if (!context) {
    throw new Error("LightBoxTrigger must be used within a LightBox");
  }

  return context;
};

const PADDING = 16;

const calculateImageSize = (
  windowWidth: number,
  windowHeight: number,
  aspectRatio = 1,
) => {
  const windowAspectRatio = windowWidth / windowHeight;

  if (windowAspectRatio > aspectRatio) {
    return {
      height: windowHeight - PADDING * 2,
      width: (windowHeight - PADDING * 2) * aspectRatio,
    };
  }

  return {
    height: (windowWidth - PADDING * 2) / aspectRatio,
    width: windowWidth - PADDING * 2,
  };
};

type LightBoxProps = {
  aspectRatio?: number;
  src: string;
  lqip?: string;
  alt?: string;
  children: React.ReactNode;
};

export const LightBox = ({
  aspectRatio,
  src,
  lqip,
  alt,
  children,
}: LightBoxProps) => {
  const [open, toggle] = useToggle();
  const { width: viewportWidth, height: viewportHeight } = useViewportSize();
  const reducedMotion = useReducedMotion();

  const { width, height } = calculateImageSize(
    viewportWidth,
    viewportHeight,
    aspectRatio,
  );

  return (
    <LightBoxContext value={{ toggle }}>
      {children}

      <Transition
        as={Fragment}
        enter={reducedMotion ? "" : "transition"}
        enterFrom={reducedMotion ? "" : "scale-50 opacity-0"}
        enterTo={reducedMotion ? "" : "scale-100 opacity-100"}
        leave={reducedMotion ? "" : "transition"}
        leaveFrom={reducedMotion ? "" : "scale-100 opacity-100"}
        leaveTo={reducedMotion ? "" : "scale-50 opacity-0"}
        show={open}
      >
        <Dialog
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center overscroll-contain bg-white bg-opacity-10 backdrop-blur-sm"
          onClick={() => toggle()}
          onClose={() => toggle()}
          open={open}
        >
          <img
            alt={alt}
            className="rounded-sm shadow-lg"
            height={height}
            src={src}
            style={{
              backgroundImage: `url(${lqip})`,
              backgroundSize: "cover",
              maxHeight: viewportHeight,
              maxWidth: viewportWidth,
            }}
            width={width}
          />
        </Dialog>
      </Transition>
    </LightBoxContext>
  );
};

export const LightBoxTrigger = (props: ComponentProps<"button">) => {
  const { toggle } = useLightBoxContext();

  return <button type="button" {...props} onClick={toggle} />;
};
