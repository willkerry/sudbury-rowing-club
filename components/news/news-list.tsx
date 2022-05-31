import HeroPost from "./hero-post";
import MoreStories from "./more-stories";
import type Post from "../../types/post";

type Props = {
  posts: Post[];
};

const NewsList = ({ posts }: Props) => (
  <>
    <HeroPost post={posts[0]} />
    <MoreStories posts={posts.slice(1)} />
  </>
);

export default NewsList;
