import Image from "next/image";
import { urlFor } from "@sudburyrc/api";
import { useLightBox } from "@/components/stour/lightbox";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

const WIDTH = 650;

type FigureProps = {
  _id?: string;
  _key?: string;
  caption: string;
  image: string;
  alt: string;
  /** @deprecated */
  altText?: string;
  lqip: string;
  aspectRatio: number;
  description: string;
};

type Orientation = "landscape" | "portrait" | "square";

const getOrientation = (aspectRatio: number): Orientation => {
  if (aspectRatio < 1.1 && aspectRatio > 0.9) {
    return "square";
  }

  if (aspectRatio > 1) return "landscape";
  return "portrait";
};

const ORIENTATION_WIDTH_MODIFIERS: Record<Orientation, number> = {
  landscape: 1,
  portrait: 0.6,
  square: 1,
};

const Figure = ({
  value: {
    caption,
    image,
    alt: newAlt,
    altText,
    lqip,
    aspectRatio,
    description,
  },
}: {
  value: FigureProps;
}) => {
  const orientation = getOrientation(aspectRatio);

  const alt = newAlt || altText || caption;
  const captionText = caption || description || "";
  const width = Math.round(WIDTH * ORIENTATION_WIDTH_MODIFIERS[orientation]);
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

      <figure className={orientation}>
        <button
          type="button"
          onClick={() => toggle()}
          className="mx-auto block hover:cursor-zoom-in"
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
