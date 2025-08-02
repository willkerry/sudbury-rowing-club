import type { ArticleSummary } from "@sudburyrc/api";
import Link from "next/link";
import { DateFormatter } from "@/components/utils/date-formatter";
import { cn } from "@/lib/utils";
import { PostPreviewImage } from "./post-preview-image";

const GRADIENT_DIRECTIONS = [
  "bg-linear-to-tr",
  "bg-linear-to-br",
  "bg-linear-to-bl",
  "bg-linear-to-tl",
];
const GRADIENT_TO = [
  "to-blue-100",
  "to-blue-100",
  "to-blue-100",
  "to-sky-200",
  "to-sky-200",
  "to-gray-200",
];

const getDeterministicGradient = (title: string) => {
  const hash = title
    .split("")
    .reduce(
      (acc, val) => val.charCodeAt(0) + (acc << 6) + (acc << 16) - acc,
      0,
    );

  const directionIndex = Math.abs(hash) % GRADIENT_DIRECTIONS.length;
  const toIndex = Math.abs(hash >> 8) % GRADIENT_TO.length;
  console.log(directionIndex, toIndex);

  return cn(
    GRADIENT_DIRECTIONS[directionIndex],
    "from-blue-50",
    GRADIENT_TO[toIndex],
  );
};

const PostPreviewText = ({ title }: { title: string }) => (
  <div
    className={cn(
      "relative h-[191px] select-none overflow-hidden border-b",
      getDeterministicGradient(title),
      "opacity-75 transition-opacity group-hover:opacity-100",
    )}
  >
    <div
      aria-hidden
      className="mx-2.5 mt-1.5 w-96 text-balance font-bold text-6xl text-black leading-none mix-blend-soft-light transition-all"
    >
      {title}
    </div>
  </div>
);

export const PostPreview = ({ post }: { post: ArticleSummary }) => (
  <li
    id={post.slug}
    className="group overflow-hidden rounded-sm border bg-white transition hover:border-blue-400"
  >
    <Link href={`/news/${post.slug}`} className="flex h-full flex-col">
      {post.featuredImage ? (
        <div className="relative h-48 overflow-hidden border-b">
          <PostPreviewImage
            id={post.featuredImage._id}
            alt={post.featuredImage.alt || post.title}
            lqip={post.featuredImage.lqip}
          />
        </div>
      ) : (
        <PostPreviewText title={post.title} />
      )}

      <h3 className="m-2 mb-3 line-clamp-3 grow text-pretty font-semibold text-xl leading-tight transition group-hover:text-blue-500">
        {post.title}
      </h3>

      {post.excerpt && (
        <p className="mx-2 line-clamp-3 font-medium text-gray-600 text-xs">
          {post.excerpt}
        </p>
      )}

      <DateFormatter
        dateString={post.date}
        className="mx-2 my-2 font-mono font-semibold text-gray-600 text-xs uppercase"
      />
    </Link>
  </li>
);
