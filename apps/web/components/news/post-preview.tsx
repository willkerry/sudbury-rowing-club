import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@sudburyrc/api";
import type { ArticleSummary } from "@sudburyrc/api";
import DateFormatter from "../utils/date-formatter";

const PostPreview = ({ post }: { post: ArticleSummary }) => (
  <li>
    <article id={post.slug}>
      <Link as={`/news/${post.slug}`} href="/news/[slug]" legacyBehavior>
        <a className="group flex flex-col divide-y overflow-hidden rounded border bg-white transition hover:border-blue-400">
          {post.featuredImage ? (
            <div className="relative">
              <Image
                src={urlFor(post.featuredImage._id)
                  .width(630)
                  .height(388)
                  .fit("crop")
                  .crop("entropy")
                  .url()}
                alt={post.featuredImage.alt || post.title}
                placeholder="blur"
                blurDataURL={post.featuredImage.lqip}
                quality={30}
                width={315}
                height={194}
                className="z-0 bg-gradient-to-r from-gray-200 to-white"
              />
            </div>
          ) : (
            <div className="relative select-none overflow-hidden bg-gray-50 text-6xl font-bold tracking-tighter text-gray-300 transition group-hover:text-blue-100">
              <div className="relative m-0 box-border block overflow-hidden">
                <div className="h-[188px] w-[305px] px-2.5 pt-1.5">
                  {post.title}
                </div>
              </div>
            </div>
          )}
          <div className="p-3">
            <div className="mb-1 text-xs font-medium text-gray-700">
              <DateFormatter dateString={post.date} />
            </div>
            <h3 className="text-xl font-semibold leading-tight tracking-tight transition group-hover:text-blue-500">
              {post.title}
            </h3>
          </div>
        </a>
      </Link>
    </article>
  </li>
);

export default PostPreview;
