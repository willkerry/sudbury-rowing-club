import HeroPost from "../hero-post";
import MoreStories from "../more-stories";

export default function NewsList({ postData }) {
  const heroPost = postData[0];
  const morePosts = postData.slice(1);
  return (
    <>
      {heroPost && (
        <HeroPost
          title={heroPost.title}
          imageId={heroPost.featuredImage._id}
          imageAlt={heroPost.featuredImage.alt}
          imageLqip={heroPost.featuredImage.lqip}
          date={heroPost.date}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
      )}
      {morePosts.length > 0 && <MoreStories posts={morePosts} />}
    </>
  );
}
