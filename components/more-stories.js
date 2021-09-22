import PostPreview from "../components/post-preview";
import smartquotes from "smartquotes";

export default function MoreStories({ posts }) {
  return (
    <section>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post) => (
          <PostPreview
            key={post._id}
            title={smartquotes(post.title)}
            imageId={
              post.featuredImage !== null ? post.featuredImage._id : null
            }
            imageAlt={
              post.featuredImage !== null ? post.featuredImage.alt : null
            }
            imageLqip={
              post.featuredImage !== null ? post.featuredImage.lqip : null
            }
            date={post.date}
            slug={post.slug}
          />
        ))}
      </ul>
    </section>
  );
}
