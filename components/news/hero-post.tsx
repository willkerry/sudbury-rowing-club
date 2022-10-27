import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import DateFormatter from "../utils/date-formatter";
import CoverImage from "./cover-image";
import type Post from "../../types/post";

const HeroPost = ({ post }: { post: Post }) => (
  (<Link
    as={`/news/${post.slug}`}
    href="/news/[slug]"
    className="grid mb-4 overflow-hidden transition duration-200 border rounded md:grid-cols-3 md:gap-x-2 group hover:border-blue-400">

    <div
      className={`relative border-b md:border-b-0 md:border-r md:col-span-2 ${
        !post.featuredImage ? "h-60 sm:h-96" : "flex"
      }`}
    >
      {post.featuredImage ? (
        <CoverImage
          title={post.title}
          src={urlFor(post.featuredImage._id)
            .width(1304)
            .height(772)
            .fit("crop")
            .crop("entropy")
            .url()}
          height={386}
          width={652}
          alt={post.featuredImage.alt}
          blurDataURL={post.featuredImage.lqip}
        />
      ) : (
        <div className="relative px-2.5 pt-1 overflow-hidden tracking-tighter font-bold text-gray-100 transition select-none text-8xl group-hover:text-blue-50 bg-white h-full">
          {post.title}
        </div>
      )}
    </div>
    <div className="flex flex-col m-4 md:my-6 md:mr-8 place-content-between">
      <p className="mb-10 text-gray-500 transition duration-200 group-hover:text-blue-300 md:mb-0">
        {post.excerpt}
      </p>
      <div>
        <div className="text-sm font-medium text-gray-700">
          <DateFormatter dateString={post.date} />
        </div>
        <h3 className="text-2xl font-bold tracking-tighter text-gray-900 transition duration-200 group-hover:text-blue-500 leading-tighter lg:text-2xl">
          {post.title}
        </h3>
      </div>
    </div>

  </Link>)
);

export default HeroPost;
