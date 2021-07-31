import Head from "next/head";
import Container from "../components/container";
import MoreStories from "../components/more-stories";
import HeroPost from "../components/hero-post";
import Intro from "../components/intro";
import Layout from "../components/layout";
import { getAllPosts } from "../lib/api";
import LandingHero from "@/components/landing/landing-hero";
import CommitteeSignature from "@/components/landing/committee-signature";
import Sponsors from "@/components/landing/sponsors";
import ParallaxImage from "@/components/landing/parallax-images";



export default function Index({ allPosts }) {
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <>
      <Layout>
        <Head>
          <title>Sudbury Rowing Club</title>
        </Head>
        <Container className="py-6">
          <LandingHero />
        </Container>
        <Container className="py-20">
          <div className="md:grid md:grid-cols-3 md:gap-8">
            <ParallaxImage />
            <div className="md:col-span-2">
              <div className="prose">
                <p className="text-lg font-semibold tracking-tight">
                  Sudbury Rowing Club is situated five minutes from the centre
                  of Sudbury in Suffolk and Essex, in the middle of scenic
                  Constable country. Rowing and sculling take place on a 1500m
                  stretch of the River Stour between a weir at one end and a low
                  bridge with shallow water at the other.{" "}
                </p>
                <p>
                  The club is active the whole year round, training through the
                  winter for the Mens’, Women’s and Masters’ eights heads in
                  March and April while for the rest of the year the club
                  concentrates on fours, pairs, doubles and sculls. We have an
                  active junior membership that often competes in various
                  competitions.
                </p>
                <CommitteeSignature className="max-w-sm py-16 mx-auto" />
                <span className="sr-only">The Committee</span>
              </div>
              <Sponsors />
            </div>
          </div>
        </Container>
        <Container>
          <Intro />
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
