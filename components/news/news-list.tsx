import HeroPost from "./hero-post";
import MoreStories from "./more-stories";
import type Post from "../../types/post";
import Link from "../stour/link";

type Props = {
  posts: Post[];
  hero?: boolean;
  more?: string;
};

const NewsList = ({ posts, hero, more }: Props) => {
  if (posts.length === 0)
    return (
      <div className="flex flex-col items-center justify-center w-full h-48">
        <p className="text-lg font-semibold text-center text-gray-500">
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
