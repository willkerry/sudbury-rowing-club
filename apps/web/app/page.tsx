import { HundredAndFiftyCta } from "@/components/anniversary/150-cta";
import Feed from "@/components/landing/feed";
import Introduction from "@/components/landing/introduction";
import LatestNews from "@/components/landing/latest-news";
import Container from "@/components/layouts/container";
import type { NoteProps } from "@/components/stour/note/note";
import type { PortableTextProps } from "@portabletext/react";
import { type ArticleSummary, sanityClient } from "@sudburyrc/api";
import groq from "groq";
import dynamic from "next/dynamic";

const Note = dynamic(() => import("@/components/stour/note"));
const Gallery = dynamic(
  () => import("@/components/regatta/landing-page/gallery"),
);
const LandingCTA = dynamic(() => import("@/components/landing/cta"));
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

async function getLandingPageContent() {
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
    landingPage: data.landingPage as LandingPageProps,
    news: data.news as ArticleSummary[],
  };
}

export const generateMetadata = async () => {
  const {
    landingPage: { tagline, title },
  } = await getLandingPageContent();

  return {
    title,
    description: tagline,
  };
};

const Home = async () => {
  const {
    news,
    landingPage: { description, heroImage, images, note, tagline },
  } = await getLandingPageContent();

  return (
    <>
      {note.display && (
        <Container>
          <Note centered label={note.label} type={note.type}>
            {note.text}
          </Note>
        </Container>
      )}
      <LandingHero
        slogan={tagline}
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
    </>
  );
};

export default Home;
