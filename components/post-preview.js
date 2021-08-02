import DateFormatter from "../components/date-formatter";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";

export function PostPreview(props) {
  const { title, coverImage, date, excerpt, author, slug } = props;

  return (
    <>
      <Link as={`/news/${slug}`} href="/news/[slug]">
        <a
          className={cn(
            "relative h-64 border rounded-lg",
            coverImage
              ? "bg-blue-800"
              : "bg-white border-gray-300 hover:border-blue-400 transition group"
          )}
        >
          {coverImage && (
            <>
              <Image
                src={coverImage}
                alt=""
                layout="fill"
                objectFit="cover"
                className="z-0 rounded-lg"
              />
              <div className="absolute w-full h-full transition duration-200 rounded-lg hover:shadow-lg opacity-70 bg-gradient-to-b from-transparent to-blue-900 hover:opacity-60"></div>
            </>
          )}

          <div
            className={cn(
              "absolute bottom-0 z-40 mx-5 my-4 text-white rounded-lg",
              coverImage ? "text-white" : "text-gray-900"
            )}
          >
            <div className="mb-1 text-sm font-medium opacity-90 ">
              <DateFormatter dateString={date} />
            </div>
            <h3
              className={cn(
                "text-2xl font-semibold tracking-tight ",
                coverImage ? "" : "transition group-hover:text-blue-500"
              )}
            >
              <a className="" dangerouslySetInnerHTML={{ __html: title }}></a>
            </h3>
          </div>
        </a>
      </Link>
    </>
  );
}
export default PostPreview;
