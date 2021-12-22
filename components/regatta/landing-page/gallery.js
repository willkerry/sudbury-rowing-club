import Image from "next/image";
import { useEmblaCarousel } from "embla-carousel/react";
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { urlFor } from "@/lib/sanity";

function Gallery({ imagesArray }) {
  const [, setSlidesInView] = useState([]);
  const [viewportRef, embla] = useEmblaCarousel({
    loop: true,
    inViewThreshold: 1,
  });

  // eslint-disable-next-line consistent-return
  const onSelect = useCallback(() => {
    if (!embla) return null;
  }, [embla]);

  const findSlidesInView = useCallback(() => {
    if (!embla) return;

    setSlidesInView((slidesInView) => {
      if (slidesInView.length === embla.slideNodes().length) {
        embla.off("select", findSlidesInView);
      }
      const inView = embla
        .slidesInView(true)
        .filter((index) => slidesInView.indexOf(index) === -1);
      return slidesInView.concat(inView);
    });
  }, [embla, setSlidesInView]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    findSlidesInView();
    embla.on("select", onSelect);
    embla.on("select", findSlidesInView);
  }, [embla, onSelect, findSlidesInView]);

  return (
    <div
      className="overflow-hidden cursor-pointer select-none"
      ref={viewportRef}
    >
      <div className="flex">
        {imagesArray.map((image) => (
          <figure
            key={image._id}
            className="relative flex-none mr-4 overflow-hidden"
            style={{
              width: 200 * image.aspectRatio,
            }}
          >
            <div className="relative flex overflow-hidden rounded">
              <Image
                src={urlFor(image._id).height(400).url()}
                width={200 * image.aspectRatio}
                height={200}
                placeholder="blur"
                blurDataURL={image.lqip}
                alt={image.caption}
              />
            </div>
            <figcaption className="flex items-center mt-1 text-sm text-gray-600">
              {image.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

Gallery.propTypes = {
  imagesArray: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Gallery;
