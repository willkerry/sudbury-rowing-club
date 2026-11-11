import type { ArticleSummary } from "@sudburyrc/api";
import { HeroPost } from "./hero-post";
import { MoreStories } from "./more-stories";

type Props = {
  posts: ArticleSummary[];
  hero?: boolean;
  more?: string;
  status?: "pending" | "success" | "error";
  error?: Error;
};

export const NewsList = ({ posts, hero, more, ...rest }: Props) => {
  if (posts.length === 0)
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center">
        <p className="text-center font-semibold text-gray-500 text-lg">
          Nothing found
        </p>
      </div>
    );

  if (hero) {
    return (
      <>
        <HeroPost post={posts[0]} />
        <MoreStories more={more} posts={posts.slice(1)} {...rest} />
      </>
    );
  }

  return <MoreStories more={more} posts={posts} {...rest} />;
};
