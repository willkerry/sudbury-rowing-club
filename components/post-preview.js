import DateFormatter from "../components/date-formatter";
import CoverImage from "./cover-image";
import Link from "next/link";
import Image from "next/image";

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) {
  return (
    <>
      <Link as={`/news/${slug}`} href="/news/[slug]">
        <a className="relative h-64 border rounded-lg bg-sudbury-brand">
          {coverImage && (
            <Image
              src={coverImage}
              alt=""
              layout="fill"
              objectFit="cover"
              className="z-0 rounded-lg"
            />
          )}
          <div className="absolute w-full h-full transition duration-200 rounded-lg hover:shadow-lg opacity-70 bg-gradient-to-b from-transparent to-gray-900 hover:opacity-80"></div>

          <div className="absolute bottom-0 z-40 mx-5 my-4 text-white rounded-lg">
          <div className="mb-1 text-sm font-medium opacity-90 ">
            <DateFormatter dateString={date} />
          </div>
          <h3 className="font-serif text-2xl tracking-tight">
            <a className="" dangerouslySetInnerHTML={{ __html: title }}></a>
          </h3>
        </div>
        </a>
      </Link>
    </>
  );
}
