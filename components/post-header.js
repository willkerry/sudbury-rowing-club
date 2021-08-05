import DateFormatter from "../components/date-formatter";
import PostTitle from "../components/post-title";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import smartypants from "@silvenon/remark-smartypants";

export default function PostHeader({ title, coverImage, date, author }) {
  return (
    <>
      <div className="max-w-2xl mx-auto my-16">
        <div className="mb-3">
          <DateFormatter dateString={date} />
          <span className="text-gray-500"></span>
        </div>
        <PostTitle>
          <ReactMarkdown remarkPlugins={[smartypants]}>{title}</ReactMarkdown>
        </PostTitle>
      </div>

      {coverImage && (
        <div className="mb-8 md:mb-16 sm:mx-0">
          <div style={{ height: "32em" }} className="max-w-3xl mx-auto">
            <div className="relative h-full max-w-full rounded-lg shadow-lg">
              <Image
                src={coverImage}
                alt={title}
                layout="fill"
                objectFit="cover"
                quality={100}
                className="rounded-lg bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
