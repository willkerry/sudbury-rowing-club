import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { type GetStaticProps, NextPage } from "next/types";
import { type PortableTextProps } from "@portabletext/react";
import groq from "groq";
import { type ArticleSummary, sanityClient } from "@sudburyrc/api";
import { HundredAndFiftyCta } from "@/components/anniversary/150-cta";
import Feed from "@/components/landing/feed";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { type NoteProps } from "@/components/stour/note/note";

const Note = dynamic(() => import("@/components/stour/note"));
const Gallery = dynamic(
  () => import("@/components/regatta/landing-page/gallery"),
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
}> = ({
  news,
  landingPage: { description, heroImage, images, note, tagline, title },
}) => (
  <Layout>
    <NextSeo
      title={title}
      description={tagline}
      openGraph={{
        description: tagline,
        title,
      }}
    />

    {note.display && (
      <Container>
        <Note centered label={note.label} type={note.type}>
          {note.text}
        </Note>
      </Container>
    )}
    <LandingHero
      slogan={tagline}
      youTubeId={heroImage.youtubeId}
      youTubeStart={heroImage.youtubeStartOffset}
      imageId={heroImage.image._id}
      imageAspectRatio={heroImage.image.aspectRatio}
      imageLqip={heroImage.image.lqip}
    />
    <LandingCTA />
    <Introduction description={description} />

    <div className="mx-auto max-w-7xl px-4 pb-20">
      <HundredAndFiftyCta />
    </div>

    <Gallery images={images} />
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
