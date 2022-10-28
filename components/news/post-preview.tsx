import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import DateFormatter from "../utils/date-formatter";
import type Post from "../../types/post";

const PostPreview = ({ post }: { post: Post }) => (
  <li>
    <article id={post.slug}>
      <Link as={`/news/${post.slug}`} href="/news/[slug]" legacyBehavior>
        <a className="flex flex-col overflow-hidden transition bg-white border divide-y rounded hover:border-blue-400 group">
          {post.featuredImage ? (
            <div className="relative">
              <Image
                src={urlFor(post.featuredImage._id)
                  .width(630)
                  .height(388)
                  .fit("crop")
                  .crop("entropy")
                  .url()}
                alt={post.featuredImage.alt}
                placeholder="blur"
                blurDataURL={post.featuredImage.lqip}
                quality={30}
                width={315}
                height={194}
                className="z-0 bg-gradient-to-r from-gray-200 to-white"
              />
            </div>
          ) : (
            <div className="relative overflow-hidden text-6xl font-bold tracking-tighter text-gray-300 transition select-none bg-gray-50 group-hover:text-blue-100">
              <div className="box-border relative block m-0 overflow-hidden">
                <div className="px-2.5 pt-1.5 pseudo-img">
                  <style jsx>{`
                    .pseudo-img {
                      width: 305px;
                      height: 188px;
                    }
                  `}</style>
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
