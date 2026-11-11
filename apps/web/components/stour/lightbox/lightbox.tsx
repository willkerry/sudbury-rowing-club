"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useToggle, useViewportSize } from "@mantine/hooks";
import { type ComponentProps, createContext, use } from "react";

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

  const { width, height } = calculateImageSize(
    viewportWidth,
    viewportHeight,
    aspectRatio,
  );

  return (
    <LightBoxContext value={{ toggle }}>
      {children}

      <Dialog.Root onOpenChange={() => toggle()} open={open}>
        <Dialog.Portal>
          <Dialog.Popup
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center overscroll-contain bg-white backdrop-blur-sm transition-[opacity,scale] duration-150 data-ending-style:scale-50 data-starting-style:scale-50 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
            onClick={() => toggle()}
          >
            <Dialog.Title className="sr-only">{alt || "Image"}</Dialog.Title>
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
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </LightBoxContext>
  );
};

export const LightBoxTrigger = (props: ComponentProps<"button">) => {
  const { toggle } = useLightBoxContext();

  return <button type="button" {...props} onClick={toggle} />;
};
