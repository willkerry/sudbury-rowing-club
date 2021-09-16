import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import LandingHero from "@/components/landing/landing-hero";
import Note from "@/components/stour/note";
import Button from "@/components/stour/button";
import landingData from "../data/landing.json";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";

const Sponsors = dynamic(() => import("@/components/landing/sponsors"));
const CommitteeSignature = dynamic(() =>
  import("@/components/landing/committee-signature")
);
const LandingImages = dynamic(() =>
  import("@/components/landing/landing-images")
);

export default function Index({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1, 4);

  return (
    <>
      <NextSeo
        title={landingData.page_title}
        description={landingData.hero.slogan}
        openGraph={{
          title: `${landingData.page_title}`,
          description: `${landingData.hero.slogan}`,
        }}
      />
      <Layout>
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
        <div className="container max-w-screen-lg md:mx-auto md:px-5">
          <LandingHero
            slogan={landingData.hero.slogan}
            youTubeId={landingData.hero.youTubeId}
            youTubeStart={landingData.hero.youTubeStart}
          />
        </div>

        <Container>
          <div className="flex items-center justify-center pt-16 space-x-3 text-white">
            <Button href="#intro" shadow size="large">
              Discover<span className="hidden sm:inline"> more</span>
            </Button>
            <Button href="/join" variant="secondary" shadow size="large">
              Join us
            </Button>
          </div>
        </Container>
        <section id="intro">
          <Container className="my-16">
            <div className="mx-auto prose">
              <p className="lead">{landingData.intro.main}</p>
              <p>{landingData.intro.secondary}</p>
              <CommitteeSignature className="w-48 py-16 mx-auto sm:w-min sm:max-w-sm" />
              <span className="sr-only">The Committee</span>
            </div>
            <Sponsors />
          </Container>
          <LandingImages />
        </section>

        <section className="my-16">
          <div className="flex items-center py-6 my-6">
            <Container>
              <Label className="max-w-prose">Latest News</Label>
              <h1 className="max-w-prose">
                For more updates, follow us on{" "}
                <Link href="https://facebook.com/sudburyrowing">Facebook</Link>.
              </h1>
            </Container>
          </div>
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
            <div className="invisible h-8" />
            <Link href="/news" arrow>
              See more
            </Link>
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
