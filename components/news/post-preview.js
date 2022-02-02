import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import DateFormatter from "../utils/date-formatter";
import { urlFor } from "@/lib/sanity";

export default function PostPreview({
  title,
  imageId,
  imageAlt,
  imageLqip,
  date,
  slug,
}) {
  return (
    <li>
      <article id={slug}>
        <Link as={`/news/${slug}`} href="/news/[slug]">
          <a className="flex flex-col overflow-hidden transition bg-white border divide-y rounded hover:border-blue-400 group">
            {imageId ? (
              <div className="relative">
                <Image
                  src={urlFor(imageId)
                    .width(610)
                    .height(376)
                    .fit("crop")
                    .crop("entropy")
                    .url()}
                  alt={imageAlt}
                  placeholder="blur"
                  blurDataURL={imageLqip}
                  quality={30}
                  width={305}
                  height={188}
                  className="z-0 bg-gradient-to-r from-gray-200 to-white"
                  layout="responsive"
                />
              </div>
            ) : (
              <div className="relative overflow-hidden text-6xl font-bold tracking-tighter text-gray-300 transition select-none bg-gray-50 group-hover:text-blue-100">
                <div className="box-border relative block m-0 overflow-hidden">
                  <div className="px-2.5 pt-1.5 pseudo-img">
                    <style jsx>{`
                      .pseudo-img {
                        width: 305px;
                        height: 188px;
                      }
                    `}</style>
                    {title}
                  </div>
                </div>
              </div>
            )}
            <div className="p-3">
              <div className="mb-1 text-xs font-medium text-gray-700">
                <DateFormatter dateString={date} />
              </div>
              <h3 className="text-xl font-semibold leading-tight tracking-tight transition group-hover:text-blue-500">
                {title}
              </h3>
            </div>
          </a>
        </Link>
      </article>
    </li>
  );
}

PostPreview.propTypes = {
  title: PropTypes.string.isRequired,
  imageId: PropTypes.string,
  imageAlt: PropTypes.string,
  imageLqip: PropTypes.string,
  date: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

PostPreview.defaultProps = {
  imageId: null,
  imageAlt: null,
  imageLqip: null,
};
