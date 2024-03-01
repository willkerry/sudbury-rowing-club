import Image from "next/image";
import { urlFor } from "@sudburyrc/api";
import { useLightBox } from "@/components/stour/lightbox";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const WIDTH = 650;

type FigureProps = {
  caption: string;
  image: string;
  altText: string;
  lqip: string;
  aspectRatio: number;
  description: string;
};

const Figure = ({
  value: { caption, image, altText, lqip, aspectRatio, description },
}: {
  value: FigureProps;
}) => {
  const orientation = aspectRatio < 1 ? "portrait" : "landscape";

  const alt = altText || caption;
  const captionText = caption || description || "";
  const width = Math.round(orientation === "portrait" ? WIDTH * 0.6 : WIDTH);
  const height = Math.round(width / aspectRatio);

  const { toggle, LightBox } = useLightBox({
    aspectRatio,
    src: urlFor(image).url(),
    lqip,
    alt,
  });

  return (
    <>
      <LightBox />

      <figure>
        <button
          type="button"
          onClick={() => toggle()}
          className="hover:cursor-zoom-in mx-auto block"
          aria-label={`View the '${alt}' image in lightbox`}
        >
          <Image
            {...useSanityImageProps(image)}
            width={width}
            height={height}
            placeholder="blur"
            blurDataURL={lqip}
            alt={alt}
            sizes={`(max-width: ${WIDTH}px) 80vw, ${width}px`}
          />
          {captionText !== null && <figcaption>{captionText}</figcaption>}
        </button>
      </figure>
    </>
  );
};

export default Figure;
