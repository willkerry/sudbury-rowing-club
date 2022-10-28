// import smartQuotes from "@/lib/helpers/smartquotes";
import PostPreview from "./post-preview";
import type Post from "../../types/post";
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";

type Props = {
  posts: Post[];
  more?: string;
};

const MoreStories = ({ posts, more }: Props) => (
  <section>
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post) => (
        <PostPreview key={post._id} post={post} />
      ))}
      {more && (
        <li>
          <Link
            href={more}
            className="flex items-center justify-center h-56 gap-1 font-medium text-gray-500 transition border rounded group hover:border-blue-400 hover:text-black"
          >
            <>
              See more{" "}
              <ArrowLongRightIcon className="w-6 h-6 transition group-hover:translate-x-2 group-hover:text-blue-500" />
            </>
          </Link>
        </li>
      )}
    </ul>
  </section>
);

export default MoreStories;
