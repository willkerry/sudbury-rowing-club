import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import NextLink from "next/link";
import { NextSeo } from "next-seo";
import groq from "groq";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Button from "@/components/stour/button";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import sanityClient from "@/lib/sanity.server";
import Text from "@/components/stour/text";
import LandingHero from "@/components/landing/landing-hero";

const Gallery = dynamic(() =>
  import("@/components/regatta/landing-page/gallery")
);
const NewsList = dynamic(() => import("@/components/news/news-list"));
const Note = dynamic(() => import("@/components/stour/note"));
const Sponsors = dynamic(() => import("@/components/landing/sponsors"));
const CommitteeSignature = dynamic(() =>
  import("@/components/landing/committee-signature")
);

export default function Index({ news, landingPage }) {
  const note = (
    <Container>
      <Note
        centered
        label={landingPage.note.label}
        type={landingPage.note.type}
      >
        {landingPage.note.text}
      </Note>
    </Container>
  );
  const latestNews = (
    <Container>
      <NewsList postData={news} />
      <div className="invisible h-8" />
      <Link href="/news" arrow>
        See more
      </Link>
    </Container>
  );
  const hero = (
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
  );
  const cta = (
    <Container>
      <div className="flex items-center justify-center pt-16 space-x-3 text-white">
        <Button as={NextLink} href="#intro" shadow size="large">
          Discover<span className="hidden sm:inline">&nbsp;more</span>
        </Button>
        <Button
          as={NextLink}
          href="/join"
          variant="secondary"
          shadow
          size="large"
        >
          Join us
        </Button>
      </div>
    </Container>
  );
  const introduction = (
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
      <Gallery imagesArray={landingPage.images} />
    </section>
  );
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
        {landingPage.note.display && note}
        {hero}
        {cta}
        {introduction}

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
          {latestNews}
        </section>
      </Layout>
    </>
  );
}

Index.propTypes = {
  news: PropTypes.arrayOf(PropTypes.object).isRequired,
  landingPage: PropTypes.shape({
    description: PropTypes.arrayOf(PropTypes.object).isRequired,
    tagline: PropTypes.string,
    title: PropTypes.string,
    note: PropTypes.shape({
      display: PropTypes.bool,
      label: PropTypes.string,
      type: PropTypes.string,
      text: PropTypes.string,
    }),
    heroImage: PropTypes.shape({
      youtubeId: PropTypes.string,
      youtubeStartOffset: PropTypes.number,
      image: PropTypes.shape({
        _id: PropTypes.string,
        aspectRatio: PropTypes.number,
        lqip: PropTypes.string,
      }),
    }),
    images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

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
    revalidate: 900,
  };
};
