import Image from "next/image";
import PropTypes from "prop-types";

export default function CoverImage({
  title,
  src,
  alt,
  height,
  width,
  blurDataURL,
}) {
  return (
    <Image
      src={src}
      alt={alt || `Cover Image for ${title}`}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );
}

CoverImage.propTypes = {
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  blurDataURL: PropTypes.string,
};

CoverImage.defaultProps = {
  blurDataURL: null,
};
