import { cn } from "@/lib/utils";
import type { ArticleSummary } from "@sudburyrc/api";
import Link from "next/link";
import DateFormatter from "../utils/date-formatter";
import CoverImage from "./cover-image";

const HeroPost = ({ post }: { post: ArticleSummary }) => (
  <Link
    href={`/news/${post.slug}`}
    className="group mb-4 grid overflow-hidden rounded-sm border transition duration-200 hover:border-blue-400 md:grid-cols-3 md:gap-x-2"
  >
    <div className="relative h-60 border-b sm:h-96 md:col-span-2 md:border-r md:border-b-0">
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
    <div className="m-3 flex flex-col place-content-between md:my-6 md:mr-8">
      <p
        className={cn(
          "mb-10 text-gray-500 transition duration-200 group-hover:text-blue-300 md:mb-0",
          !post.excerpt && "hidden md:block",
          post.isSyntheticExcerpt && "line-clamp-4",
        )}
      >
        {post.excerpt && post.excerpt}
      </p>
      <div>
        <div className="mb-1 font-mono font-semibold text-gray-600 text-xs uppercase">
          <DateFormatter dateString={post.date} />
        </div>
        <h3 className="text-balance font-semibold text-2xl text-gray-900 leading-tighter tracking-tight transition duration-200 group-hover:text-blue-500">
          {post.title}
        </h3>
      </div>
    </div>
  </Link>
);

export default HeroPost;
