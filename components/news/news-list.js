import PropTypes from "prop-types";
import HeroPost from "../hero-post";
import MoreStories from "../more-stories";

export default function NewsList({ postData }) {
  const heroPost = postData[0];
  const morePosts = postData.slice(1);
  return (
    <>
      {heroPost.featuredImage ? (
        <HeroPost
          title={heroPost.title}
          imageId={heroPost.featuredImage._id}
          imageAlt={heroPost.featuredImage.alt}
          imageLqip={heroPost.featuredImage.lqip}
          date={heroPost.date}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
      ) : (
        <HeroPost
          title={heroPost.title}
          date={heroPost.date}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
      )}
      {morePosts.length > 0 && <MoreStories posts={morePosts} />}
    </>
  );
}
NewsList.propTypes = {
  postData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      featuredImage: PropTypes.shape({
        _id: PropTypes.string,
        alt: PropTypes.string,
        lqip: PropTypes.string,
        aspectRatio: PropTypes.number,
        caption: PropTypes.string,
      }),
    })
  ).isRequired,
};
