import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import type { ArticleSummary } from "@sudburyrc/api";
import Link from "next/link";
import Loading from "../stour/loading";
import PostPreview from "./post-preview";

type Props = {
  posts: ArticleSummary[];
  more?: string;
  status?: "pending" | "success" | "error";
  error?: Error;
};

const MoreStories = ({ posts, more, status, error }: Props) => {
  if (status === "error") {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center">
        <p className="text-center font-semibold text-gray-500 text-lg">
          {error?.message}
        </p>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
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
              <ArrowLongRightIcon
                aria-hidden
                className="h-6 w-6 transition group-hover:translate-x-2 group-hover:text-blue-500"
              />
            </Link>
          </li>
        )}
      </ul>
    </section>
  );
};

export default MoreStories;
