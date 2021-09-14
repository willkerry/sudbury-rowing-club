import { BASE_URL } from "@/lib/constants";
import Container from "@/components/container";
import MoreStories from "@/components/more-stories";
import HeroPost from "@/components/hero-post";
import Layout from "@/components/layout";
import { getAllPosts } from "../../lib/api";
import { NextSeo } from "next-seo";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";

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
      {/* <HeroTitle title="News" transparent/>  */}
      <div className="flex items-center py-6 border-t border-b">
        <Container>
          <Label className="max-w-prose">Latest News</Label>
          <h1 className="max-w-prose">
            For more updates, follow us on{" "}
            <Link href="https://facebook.com/sudburyrowing">Facebook</Link>.
          </h1>
        </Container>
      </div>
      <Container className="my-10">
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
