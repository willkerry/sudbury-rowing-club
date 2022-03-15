import cn from "classnames";
import PropTypes from "prop-types";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import DateFormatter from "../utils/date-formatter";
import PostTitle from "./post-title";
import Label from "../stour/label";

export default function PostHeader({
  title,
  featuredImage,
  date,
  alt,
  caption,
  lqip,
}) {
  const captionBlock = (
    <figcaption className="px-3 py-2 text-xs font-medium bg-bottom bg-cover">
      {caption}
    </figcaption>
  );
  if (featuredImage && featuredImage.aspectRatio > 1)
    return (
      <>
        <Heading date={date} title={title} center />
        <div className="mb-8 md:mb-16 sm:mx-0">
          <figure className="relative flex flex-col max-w-3xl mx-auto overflow-hidden text-gray-600 bg-gray-200 rounded">
            <style jsx>{`
              figure {
                background-color: ${featuredImage.background};
                color: ${featuredImage.foreground};
              }
            `}</style>
            <Image
              src={urlFor(featuredImage._id).width(1536).fit("max").url()}
              alt={alt}
              width={768}
              height={768 / featuredImage.aspectRatio}
              quality={50}
              placeholder="blur"
              blurDataURL={lqip}
            />
            {caption && captionBlock}
          </figure>
        </div>
      </>
    );
  if (featuredImage)
    return (
      <div className="flex-row items-center max-w-3xl gap-8 mx-auto mb-8 sm:flex md:mb-16">
        <div className="my-12">
          <Label>
            <DateFormatter dateString={date} />
          </Label>
          <PostTitle>{title}</PostTitle>
        </div>
        <div className="relative flex-none">
          <figure
            className="flex flex-col overflow-hidden rounded shadow-lg"
            style={{ maxWidth: 512 * featuredImage.aspectRatio }}
          >
            <style jsx>{`
              figure {
                background-color: ${featuredImage.background};
                color: ${featuredImage.foreground};
              }
            `}</style>
            <Image
              src={urlFor(featuredImage._id).height(1024).fit("max").url()}
              alt={title}
              width={512 * featuredImage.aspectRatio}
              height={512}
              quality={50}
              className="bg-gray-50"
              placeholder="blur"
              blurDataURL={lqip}
            />
            {caption && captionBlock}
          </figure>
        </div>
      </div>
    );
  return <Heading date={date} title={title} center />;
}

PostHeader.propTypes = {
  title: PropTypes.string.isRequired,
  featuredImage: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    aspectRatio: PropTypes.number.isRequired,
    background: PropTypes.string,
    foreground: PropTypes.string,
  }),
  date: PropTypes.string.isRequired,
  alt: PropTypes.string,
  caption: PropTypes.string,
  lqip: PropTypes.string,
};

PostHeader.defaultProps = {
  featuredImage: null,
  caption: null,
  lqip: null,
  alt: null,
};

function Heading({ date, title, center }) {
  return (
    <div className={cn("max-w-2xl mx-auto my-12", center && "text-center")}>
      <Label>
        <DateFormatter dateString={date} />
      </Label>
      <PostTitle>{title}</PostTitle>
    </div>
  );
}

Heading.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  center: PropTypes.bool,
};

Heading.defaultProps = {
  center: false,
};
