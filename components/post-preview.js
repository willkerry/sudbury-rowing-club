import DateFormatter from "../components/date-formatter";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";

export function PostPreview(props) {
  const { title, coverImage, date, excerpt, author, slug } = props;

  return (
    <li>
      <article id={slug}>
        <Link as={`/news/${slug}`} href="/news/[slug]">
          <a className="flex flex-col overflow-hidden transition bg-white border divide-y rounded hover:border-blue-400 group">
            {coverImage ? (
              <div className="relative h-56 sm:h-48 md:h-36 lg:h-56">
                <Image
                  src={coverImage}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className="z-0 bg-gradient-to-r from-gray-200 to-white"
                  sizes="15vw"
                />
              </div>
            ) : (
              <div className="relative h-56 sm:h-48 md:h-36 lg:h-56 px-2.5 pt-1.5 overflow-hidden text-6xl font-bold tracking-tighter text-gray-100 transition select-none group-hover:text-blue-50">
                {title}
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
export default PostPreview;
