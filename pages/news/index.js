import { BASE_URL } from "@/lib/constants";
import Container from "@/components/container";
import MoreStories from "@/components/more-stories";
import HeroPost from "@/components/hero-post";
import Layout from "@/components/layout";
import { getAllPosts } from "../../lib/api";
import HeroTitle from "@/components/hero-title";
import { NextSeo } from "next-seo";

export default function News({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <Layout>
      <NextSeo
        title="News | Sudbury Rowing Club"
        description="Latest news from Sudbury Rowing Club."
        openGraph={{
          title: "Latest News",
          description: "Latest news from Sudbury Rowing Club.",
          images: [{ url: BASE_URL + "/assets/og/news.png" }],
        }}
      />
      <HeroTitle title="Latest News" />
      <Container className="pt-12">
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    "title",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);

  return {
    props: { allPosts },
    revalidate: 60,
  };
}
