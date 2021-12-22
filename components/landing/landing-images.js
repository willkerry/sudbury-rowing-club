import Image from "next/image";
import PropTypes from "prop-types";
import { urlFor } from "@/lib/sanity";

export default function LandingImages({ images: imageArray }) {
  const images = imageArray.slice(0, 3);
  return (
    <div className="my-10 border-t border-b sm:my-16">
      <div className="flex flex-row">
        {images.map(({ _id, caption, lqip }) => (
          <div key={_id} className="relative w-1/3 h-24 bg-black sm:h-72">
            <Image
              src={urlFor(_id).height(576).url()}
              alt={caption}
              layout="fill"
              sizes="33.3vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL={lqip}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
LandingImages.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
      lqip: PropTypes.string.isRequired,
    })
  ).isRequired,
};
