import { fetchLandingPage } from "@sudburyrc/api";
import Script from "next/script";
import { useId } from "react";
import { LandingCTA } from "@/components/landing";
import { CommitteeSignature } from "@/components/landing/committee-signature";
import { Feed } from "@/components/landing/feed";
import { LandingHero } from "@/components/landing/landing-hero";
import { Affiliates, Sponsors } from "@/components/landing/sponsors";
import { Container } from "@/components/layouts/container";
import { NewsList } from "@/components/news/news-list";
import { Gallery } from "@/components/regatta/landing-page/gallery";
import { Label } from "@/components/stour/label";
import { Link } from "@/components/stour/link";
import { Text } from "@/components/stour/text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ClubJsonLd, SOCIALS } from "@/lib/constants";

export const generateMetadata = async () => {
  const {
    landingPage: { tagline, title },
  } = await fetchLandingPage();

  return {
    title,
    description: tagline,
  };
};

const Home = async () => {
  const introId = useId();

  const {
    landingPage: { note, heroImage, tagline, description, images },
    news,
  } = await fetchLandingPage();

  return (
    <>
      <Script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ClubJsonLd) }}
        id="club-json-ld"
        type="application/ld+json"
      />

      {note.display && (
        <Container>
          <Alert variant="default">
            <AlertTitle>{note.label}</AlertTitle>
            <AlertDescription>{note.text}</AlertDescription>
          </Alert>
        </Container>
      )}

      <Container>
        <LandingHero
          description={tagline}
          imageAspectRatio={heroImage.aspectRatio}
          imageId={heroImage._id}
          imageLqip={heroImage.lqip}
        />
      </Container>

      <Container>
        <LandingCTA introId={introId} />
      </Container>

      <Container className="my-16">
        <div className="mx-auto my-16">
          <Text
            className="mx-auto my-16"
            id={introId}
            portableText={description}
          />
          <span className="sr-only">The Committee</span>
          <CommitteeSignature aria-hidden className="mx-auto w-48" />
          <Affiliates />
        </div>

        <Sponsors className="mb-24" heading="Sponsored by" />
      </Container>

      <Gallery images={images} />

      <Container className="my-32">
        <h2>
          <Label>Latest News</Label>
        </h2>
        <p className="mb-12">
          For more updates, follow us on{" "}
          <Link href={SOCIALS.facebook.href}>{SOCIALS.facebook.name}</Link>.
        </p>
        <NewsList hero posts={news} />
        <div className="h-8" />
        <Link arrow href="/news">
          See more news
        </Link>
      </Container>

      <Container>
        <Feed />
      </Container>
    </>
  );
};

export default Home;
