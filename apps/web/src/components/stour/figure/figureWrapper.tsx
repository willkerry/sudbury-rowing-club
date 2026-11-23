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
>(({ alt, aspectRatio, blurDataURL, src, children, ...rest }, ref) => (
  <LightBox alt={alt} aspectRatio={aspectRatio} lqip={blurDataURL} src={src}>
    <figure {...rest} ref={ref}>
      <LightBoxTrigger
        aria-label={`View the '${alt}' image in lightbox`}
        className="block text-left hover:cursor-zoom-in"
      >
        {children}
      </LightBoxTrigger>
    </figure>
  </LightBox>
));
