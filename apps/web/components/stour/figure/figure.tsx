import { urlFor } from "@sudburyrc/api";
import Image from "next/image";
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
  const alt = altText || caption;
  const captionText = caption || description || "";
  const width = Math.round(aspectRatio < 1 ? WIDTH * 0.6 : WIDTH * aspectRatio);
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
          className="hover:cursor-zoom-in"
          aria-label={`View the '${alt}' image in lightbox`}
        >
          <Image
            {...useSanityImageProps(image)}
            width={width}
            placeholder="blur"
            blurDataURL={lqip}
            height={height}
            alt={alt}
            className="mx-auto"
          />
          {captionText !== null && <figcaption>{captionText}</figcaption>}
        </button>
      </figure>
    </>
  );
};

export default Figure;
