import dynamic from "next/dynamic";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Feed from "@/components/landing/feed";
import { type NoteProps } from "@/components/stour/note/note";
import sanityClient from "@/lib/sanity.server";
import { type PortableTextProps } from "@portabletext/react";
import groq from "groq";
import { NextSeo } from "next-seo";
import { NextPage, type GetStaticProps } from "next/types";
import type { ArticleSummary } from "@/lib/queries/fetch-news-article";
import Socials from "@/components/landing/socials";

const Note = dynamic(() => import("@/components/stour/note"));
const Gallery = dynamic(
  () => import("@/components/regatta/landing-page/gallery")
);
const LandingCTA = dynamic(() => import("@/components/landing/cta"));
const Introduction = dynamic(() => import("@/components/landing/introduction"));
const LatestNews = dynamic(() => import("@/components/landing/latest-news"));
const LandingHero = dynamic(() => import("@/components/landing/landing-hero"));

export type LandingPageProps = {
  description: PortableTextProps["value"];
  tagline: string;
  title: string;
  note: {
    display: boolean;
    label: string;
    type: NoteProps["type"];
    text: string;
  };
  heroImage: {
    youtubeId: string;
    youtubeStartOffset: number;
    image: {
      _id: string;
      aspectRatio: number;
      lqip: string;
    };
  };
  images: {
    _id: string;
    caption: string;
    lqip: string;
    aspectRatio: number;
  }[];
};

const Home: NextPage<{
  news: ArticleSummary[];
  landingPage: LandingPageProps;
}> = ({ news, landingPage }) => (
  <Layout>
    <NextSeo
      title={landingPage.title}
      description={landingPage.tagline}
      openGraph={{
        description: `${landingPage.tagline}`,
        title: `${landingPage.title}`,
      }}
    />

    {landingPage.note.display && (
      <Container>
        <Note
          centered
          label={landingPage.note.label}
          type={landingPage.note.type}
        >
          {landingPage.note.text}
        </Note>
      </Container>
    )}
    <LandingHero
      slogan={landingPage.tagline}
      youTubeId={landingPage.heroImage.youtubeId}
      youTubeStart={landingPage.heroImage.youtubeStartOffset}
      imageId={landingPage.heroImage.image._id}
      imageAspectRatio={landingPage.heroImage.image.aspectRatio}
      imageLqip={landingPage.heroImage.image.lqip}
    />
    <LandingCTA />
    <div className="my-12">
      <Socials />
    </div>
    <Introduction description={landingPage.description} />
    <Gallery images={landingPage.images} />
    <LatestNews news={news} />
    <Container>
      <Feed />
    </Container>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const data = await sanityClient.fetch(groq`
    {
      "landingPage": *[_id == "siteSettings" && !(_id in path("drafts.**"))][0].landingPage {
        description,
        images[] { 
          caption, 
          "_id": asset->_id,
          "lqip": asset->metadata.lqip,
          "aspectRatio": asset->metadata.dimensions.aspectRatio
          },
        heroImage {
          image {
            "_id": asset->_id,
            "lqip": asset->metadata.lqip,
            "aspectRatio": asset->metadata.dimensions.aspectRatio,
          }, 
          youtubeId,
          youtubeStartOffset
        },
        note,
        tagline,
        title,
      },
      "news": *[_type == "news" && !(_id in path("drafts.**"))] | order(date desc){
        _id,
        "slug": slug.current,
        title,
        excerpt,
        date,
        featuredImage {
          alt, 
          caption,
          "_id": @.image.asset->_id, 
          "lqip": @.image.asset->metadata.lqip, 
          "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio
        },
      }[0..3]
    }
   `);

  return {
    props: {
      landingPage: data.landingPage,
      news: data.news,
    },
  };
};

export default Home;
