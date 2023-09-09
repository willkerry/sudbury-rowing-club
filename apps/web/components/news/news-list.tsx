import type { ArticleSummary } from "@sudburyrc/api";
import HeroPost from "./hero-post";
import MoreStories from "./more-stories";

type Props = {
  posts: ArticleSummary[];
  hero?: boolean;
  more?: string;
};

const NewsList = ({ posts, hero, more }: Props) => {
  if (posts.length === 0)
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center">
        <p className="text-center text-lg font-semibold text-gray-500">
          Nothing found
        </p>
      </div>
    );

  if (hero) {
    return (
      <>
        <HeroPost post={posts[0]} />
        <MoreStories posts={posts.slice(1)} {...{ more }} />
      </>
    );
  }

  return <MoreStories {...{ more, posts }} />;
};

export default NewsList;
