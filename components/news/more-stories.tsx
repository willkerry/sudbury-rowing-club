// import smartQuotes from "@/lib/helpers/smartquotes";
import PostPreview from "./post-preview";
import type Post from "../../types/post";

type Props = {
  posts: Post[];
};

const MoreStories = ({ posts }: Props) => (
  <section>
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {posts.map((post) => (
        <PostPreview key={post._id} post={post} />
      ))}
    </ul>
  </section>
);

export default MoreStories;
