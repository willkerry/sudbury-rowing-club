import Image from "next/image";
import PropTypes from "prop-types";
import { ArrowUpIcon } from "@heroicons/react/solid";
import { urlFor } from "@/lib/sanity";

export default function RegattaHeroImage({
  title,
  subtitle,
  aspectRatio,
  src,
  blurDataURL,
}) {
  const imageWidth = 984;
  const imageHeight = imageWidth / aspectRatio;

  return (
    <div className="relative flex overflow-hidden shadow-lg rounded-xl">
      <Image
        src={urlFor(src)
          .width(2 * imageWidth)
          .height(2 * imageHeight)
          .url()}
        placeholder="blur"
        alt=""
        blurDataURL={blurDataURL}
        width={imageWidth}
        height={imageHeight}
      />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black via-transparent to-transparent" />
      <div className="absolute top-0 left-0 flex items-end w-full h-full p-6 md:p-12">
        <div className="hidden w-2/3 sm:block">
          <div className="max-w-sm text-4xl font-bold tracking-tighter text-white md:text-6xl leading-tighter drop-shadow">
            {title}
          </div>
          <div className="font-medium text-white opacity-75">
            <ArrowUpIcon className="inline-flex w-4 h-4 mb-px" size="1em" />{" "}
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}

RegattaHeroImage.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  aspectRatio: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  blurDataURL: PropTypes.string.isRequired,
};
