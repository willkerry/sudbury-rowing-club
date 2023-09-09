import type { ArticleSummary } from "@sudburyrc/api";
import Link from "next/link";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import PostPreview from "./post-preview";

type Props = {
  posts: ArticleSummary[];
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
            className="group flex h-56 items-center justify-center gap-1 rounded border font-medium text-gray-500 transition hover:border-blue-400 hover:text-black"
          >
            See more{" "}
            <ArrowLongRightIcon className="h-6 w-6 transition group-hover:translate-x-2 group-hover:text-blue-500" />
          </Link>
        </li>
      )}
    </ul>
  </section>
);

export default MoreStories;
