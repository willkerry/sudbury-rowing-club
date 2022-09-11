import HeroPost from "./hero-post";
import MoreStories from "./more-stories";
import type Post from "../../types/post";

type Props = {
  posts: Post[];
  hero?: boolean;
  more?: string;
};

const NewsList = ({ posts, hero, more }: Props) => (
  <>
    {hero && <HeroPost post={posts[0]} />}
    <MoreStories posts={posts.slice(hero ? 1 : 0)} {...{ more }} />
  </>
);

export default NewsList;
