import Container from "../components/container";
import Layout from "../components/layout";
import LandingHero from "@/components/landing/landing-hero";
import Note from "@/components/stour/note";
import Button from "@/components/stour/button";
import dynamic from "next/dynamic";
import { NextSeo } from "next-seo";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import groq from "groq";
import { sanityClient } from "@/lib/sanity.server";
import Text from "@/components/stour/text";
import NewsList from "@/components/news/news-list";

const Sponsors = dynamic(() => import("@/components/landing/sponsors"));
const CommitteeSignature = dynamic(() =>
  import("@/components/landing/committee-signature")
);
const LandingImages = dynamic(() =>
  import("@/components/landing/landing-images")
);

export default function Index({ news, landingPage }) {
  return (
    <>
      <NextSeo
        title={landingPage.title}
        description={landingPage.tagline}
        openGraph={{
          title: `${landingPage.title}`,
          description: `${landingPage.tagline}`,
        }}
      />
      <Layout>
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
        <div className="container max-w-screen-lg md:mx-auto md:px-5">
          <LandingHero
            slogan={landingPage.tagline}
            youTubeId={landingPage.heroImage.youtubeId}
            youTubeStart={landingPage.heroImage.youtubeStartOffset}
            imageId={landingPage.heroImage.image._id}
            imageAspectRatio={landingPage.heroImage.image.aspectRatio}
            imageLqip={landingPage.heroImage.image.lqip}
          />
        </div>

        <Container>
          <div className="flex items-center justify-center pt-16 space-x-3 text-white">
            <Button href="#intro" shadow size="large">
              Discover<span className="hidden sm:inline">&nbsp;more</span>
            </Button>
            <Button href="/join" variant="secondary" shadow size="large">
              Join us
            </Button>
          </div>
        </Container>
        <section id="intro">
          <Container className="my-16">
            <div className="mx-auto ">
              <Text portableText lead className="mx-auto">
                {landingPage.description}
              </Text>
              <CommitteeSignature className="w-48 py-16 mx-auto sm:w-min sm:max-w-sm" />
              <span className="sr-only">The Committee</span>
            </div>
            <Sponsors />
          </Container>
          <LandingImages images={landingPage.images} />
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
            <NewsList postData={news} />
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

export const getStaticProps = async () => {
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
    revalidate: 7200,
  };
};
