import React from "react";
import { LightBox, LightBoxTrigger } from "@/components/stour/lightbox";

export const FigureWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    alt?: string;
    aspectRatio?: number;
    blurDataURL?: string;
    src: string;
  }
>(({ alt, aspectRatio, blurDataURL, src, children, ...rest }, ref) => {
  return (
    <LightBox aspectRatio={aspectRatio} src={src} lqip={blurDataURL} alt={alt}>
      <figure {...rest} ref={ref}>
        <LightBoxTrigger
          className="block text-left hover:cursor-zoom-in"
          aria-label={`View the '${alt}' image in lightbox`}
        >
          {children}
        </LightBoxTrigger>
      </figure>
    </LightBox>
  );
});
