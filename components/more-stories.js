import PostPreview from "../components/post-preview";

export default function MoreStories({ posts }) {
  return (
    <section>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </ul>
    </section>
  );
}
