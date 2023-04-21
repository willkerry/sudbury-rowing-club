import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { useLightBox } from "@/components/stour/lightbox";

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
  const width = aspectRatio < 1 ? WIDTH * 0.6 : WIDTH * aspectRatio;
  const height = width / aspectRatio;

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
        <button onClick={() => toggle()} className="hover:cursor-zoom-in">
          <Image
            src={
              aspectRatio
                ? urlFor(image).width(1300).fit("max").url()
                : urlFor(image)
                    .width(width * 2)
                    .height(height * 2)
                    .fit("min")
                    .url()
            }
            width={width}
            placeholder="blur"
            blurDataURL={lqip}
            height={height}
            alt={alt}
          />
          {captionText !== null && <figcaption>{captionText}</figcaption>}
        </button>
      </figure>
    </>
  );
};

export default Figure;
