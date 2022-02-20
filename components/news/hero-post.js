import Link from "next/link";
import PropTypes from "prop-types";
import { urlFor } from "@/lib/sanity";
import DateFormatter from "../utils/date-formatter";
import CoverImage from "./cover-image";

export default function HeroPost({
  title,
  date,
  excerpt,
  slug,
  imageId,
  imageAlt,
  imageLqip,
}) {
  return (
    <Link as={`/news/${slug}`} href="/news/[slug]">
      <a className="grid mb-12 overflow-hidden transition duration-200 border rounded md:grid-cols-3 md:gap-x-8 group hover:border-blue-400">
        <div
          className={`relative border-b md:border-b-0 md:border-r md:col-span-2 ${
            !imageId ? "h-60 sm:h-96" : "flex"
          }`}
        >
          {imageId ? (
            <CoverImage
              title={title}
              src={urlFor(imageId)
                .width(1286)
                .height(772)
                .fit("crop")
                .crop("entropy")
                .url()}
              height={386}
              width={643}
              alt={imageAlt}
              blurDataURL={imageLqip}
            />
          ) : (
            <div className="relative px-2.5 pt-1 overflow-hidden tracking-tighter font-bold text-gray-100 transition select-none text-8xl group-hover:text-blue-50 bg-white h-full">
              {title}
            </div>
          )}
        </div>
        <div className="flex flex-col m-4 md:my-8 md:mr-8 place-content-between">
          <p className="mb-10 text-gray-500 transition duration-200 group-hover:text-blue-300 md:mb-0">
            {excerpt}
          </p>
          <div>
            <div className="text-sm font-medium text-gray-700">
              <DateFormatter dateString={date} />
            </div>
            <h3 className="text-2xl font-bold tracking-tighter text-gray-900 transition duration-200 group-hover:text-blue-500 leading-tighter lg:text-2xl">
              {title}
            </h3>
          </div>
        </div>
      </a>
    </Link>
  );
}

HeroPost.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  imageId: PropTypes.string,
  imageAlt: PropTypes.string,
  imageLqip: PropTypes.string,
};

HeroPost.defaultProps = {
  imageId: null,
  imageAlt: null,
  imageLqip: null,
};
