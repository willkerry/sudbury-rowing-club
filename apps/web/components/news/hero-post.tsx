import type { ArticleSummary } from "@sudburyrc/api";
import Link from "next/link";
import DateFormatter from "../utils/date-formatter";
import CoverImage from "./cover-image";

const HeroPost = ({ post }: { post: ArticleSummary }) => (
  <Link
    as={`/news/${post.slug}`}
    href="/news/[slug]"
    className="group mb-4 grid overflow-hidden rounded border transition duration-200 md:grid-cols-3 md:gap-x-2 hover:border-blue-400"
  >
    <div className="relative h-60 border-b md:col-span-2 sm:h-96 md:border-r md:border-b-0">
      {post.featuredImage ? (
        <CoverImage
          title={post.title}
          id={post.featuredImage._id}
          alt={post.featuredImage.alt || post.title}
          blurDataURL={post.featuredImage.lqip}
        />
      ) : (
        <div className="relative h-full select-none overflow-hidden bg-white px-2.5 pt-1 font-bold text-8xl text-gray-100 transition group-hover:text-blue-50">
          {post.title}
        </div>
      )}
    </div>
    <div className="m-4 flex flex-col place-content-between md:my-6 md:mr-8">
      <p className="mb-10 text-gray-500 transition duration-200 md:mb-0 group-hover:text-blue-300">
        {post.excerpt}
      </p>
      <div>
        <div className="mb-1 font-medium text-gray-700 text-xs">
          <DateFormatter dateString={post.date} />
        </div>
        <h3 className="font-semibold text-2xl text-gray-900 leading-tighter tracking-tight transition duration-200 group-hover:text-blue-500 lg:text-2xl">
          {post.title}
        </h3>
      </div>
    </div>
  </Link>
);

export default HeroPost;
