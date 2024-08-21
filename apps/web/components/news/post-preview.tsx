"use client";

import { useSanityImageProps } from "@/hooks/useSanityImageProps";
import type { ArticleSummary } from "@sudburyrc/api";
import Image from "next/image";
import Link from "next/link";
import DateFormatter from "../utils/date-formatter";

const PostImage = ({
  id,
  alt,
  lqip,
}: {
  id: string;
  alt: string;
  lqip: string;
}) => {
  const { src, loader } = useSanityImageProps(id);

  return (
    <Image
      loader={loader}
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL={lqip}
      fill
      quality={20}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 218px, 316px"
      className="z-0 bg-gradient-to-r from-gray-200 to-white object-cover"
    />
  );
};

const PostPreview = ({ post }: { post: ArticleSummary }) => (
  <li>
    <article id={post.slug}>
      <Link
        as={`/news/${post.slug}`}
        href="/news/[slug]"
        className="group flex flex-col divide-y overflow-hidden rounded border bg-white transition hover:border-blue-400"
      >
        {post.featuredImage ? (
          <div className="relative h-48 overflow-hidden">
            <PostImage
              id={post.featuredImage._id}
              alt={post.featuredImage.alt || post.title}
              lqip={post.featuredImage.lqip}
            />
          </div>
        ) : (
          <div className="relative select-none overflow-hidden bg-gray-50 text-6xl font-bold text-gray-300 transition group-hover:text-blue-100">
            <div className="relative m-0 box-border block overflow-hidden">
              <div aria-hidden className="h-[188px] w-[305px] px-2.5 pt-1.5">
                {post.title}
              </div>
            </div>
          </div>
        )}
        <div className="p-3">
          <div className="mb-1 text-xs font-medium text-gray-700">
            <DateFormatter dateString={post.date} />
          </div>
          <h3 className="text-xl font-semibold leading-tight transition group-hover:text-blue-500">
            {post.title}
          </h3>
        </div>
      </Link>
    </article>
  </li>
);

export default PostPreview;
