import Head from "next/head";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import LandingHero from "@/components/landing/landing-hero";
import CommitteeSignature from "@/components/landing/committee-signature";
import Sponsors from "@/components/landing/sponsors";
import ParallaxImage from "@/components/landing/parallax-images";
import Note from "@/components/stour/note";

import landingData from "../data/landing.json";
import Hero from "@/components/stour/hero";

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
            youtube={landingData.hero.youtube_embed_url}
          />
        </Container>
        <section>
          <Container className="py-20">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              <ParallaxImage />
              <div className="md:col-span-2">
                <div className="prose">
                  <p className="text-lg font-semibold tracking-tight">
                    {landingData.intro.main}
                  </p>
                  <p>{landingData.intro.secondary}</p>
                  <CommitteeSignature className="max-w-sm py-16 mx-auto" />
                  <span className="sr-only">The Committee</span>
                </div>
                <Sponsors />
              </div>
            </div>
          </Container>
        </section>
        <section className="pt-16 pb-4 bg-blue-50">
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
