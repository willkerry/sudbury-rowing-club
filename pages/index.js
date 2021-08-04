import Head from "next/head";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import LandingHero from "@/components/landing/landing-hero";
import CommitteeSignature from "@/components/landing/committee-signature";
import Sponsors from "@/components/landing/sponsors";
import Note from "@/components/stour/note";
import Button from "@/components/stour/button";
import landingData from "../data/landing.json";
import LandingImages from "@/components/landing/landing-images";

export default function Index({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1, 4);

  return (
    <>
      <Layout>
        <Head>
          <title>{landingData.page_title}</title>
        </Head>
        {landingData.notice.display && (
          <Container>
            <Note
              centered
              label={landingData.notice.label}
              type={landingData.notice.type}
              size="small"
            >
              {landingData.notice.text}
            </Note>
          </Container>
        )}
        <Container className="py-6">
          <LandingHero
            slogan={landingData.hero.slogan}
            youTubeId={landingData.hero.youTubeId}
            youTubeStart={landingData.hero.youTubeStart}
          />
          <div className="flex items-center justify-center pt-16 space-x-3 text-white">
            <Button label="Discover more" shadow size="large" />
            <Button label="Join us" variant="secondary" shadow size="large" />
          </div>
        </Container>
        <section>
          <Container className="mt-16">
            <div className="mx-auto prose">
              <p className="lead">{landingData.intro.main}</p>
              <p>{landingData.intro.secondary}</p>
              <CommitteeSignature className="max-w-sm py-16 mx-auto" />
              <span className="sr-only">The Committee</span>
            </div>
            <Sponsors />
          </Container>
          <LandingImages />
        </section>
        <section className="pt-16 pb-4 ">
          <Container>
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
        </section>
      </Layout>
    </>
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
  };
}
