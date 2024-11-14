import type { ArticleSummary } from "@sudburyrc/api";
import Link from "next/link";
import DateFormatter from "../utils/date-formatter";
import { PostPreviewImage } from "./post-preview-image";
import { cn } from "@/lib/utils";
import { NewspaperIcon } from "@heroicons/react/24/outline";

const GRADIENT_DIRECTIONS = [
  "bg-gradient-to-tr",
  "bg-gradient-to-br",
  "bg-gradient-to-bl",
  "bg-gradient-to-tl",
];
const GRADIENT_TO = [
  "to-blue-100",
  "to-blue-100",
  "to-blue-100",
  "to-sky-200",
  "to-sky-200",
  "to-gray-200",
];

const getRandomGradient = () =>
  cn(
    GRADIENT_DIRECTIONS[
      Math.floor(Math.random() * 10) % GRADIENT_DIRECTIONS.length
    ],
    "from-blue-50",
    GRADIENT_TO[Math.floor(Math.random() * 10) % GRADIENT_TO.length],
  );

const PostPreview = ({ post }: { post: ArticleSummary }) => (
  <li
    id={post.slug}
    className="group rounded border bg-white transition overflow-hidden hover:border-blue-400"
  >
    <Link href={`/news/${post.slug}`} className="flex flex-col h-full">
      {post.featuredImage ? (
        <div className="relative h-48 overflow-hidden border-b">
          <PostPreviewImage
            id={post.featuredImage._id}
            alt={post.featuredImage.alt || post.title}
            lqip={post.featuredImage.lqip}
          />
        </div>
      ) : (
        <div
          className={cn(
            "relative select-none h-[191px] overflow-hidden border-b",
            getRandomGradient(),
            "group-hover:opacity-100 opacity-75 transition-opacity",
          )}
        >
          <div
            aria-hidden
            className="mx-2.5 mt-1.5 leading-none text-balance w-96 text-6xl font-bold text-black mix-blend-soft-light transition-all"
          >
            {post.title}
          </div>
        </div>
      )}

      <h3 className="text-xl m-2 mb-3 grow line-clamp-3 font-semibold leading-tight text-pretty transition group-hover:text-blue-500">
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="text-xs font-medium text-gray-600 mx-2 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      <DateFormatter
        dateString={post.date}
        className="text-xs font-semibold uppercase font-mono text-gray-600 mx-2 my-2"
      />
    </Link>
  </li>
);

export default PostPreview;
