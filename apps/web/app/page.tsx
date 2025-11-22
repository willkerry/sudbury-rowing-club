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
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ClubJsonLd) }}
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
          imageId={heroImage._id}
          imageAspectRatio={heroImage.aspectRatio}
          imageLqip={heroImage.lqip}
          description={tagline}
        />
      </Container>

      <Container>
        <LandingCTA introId={introId} />
      </Container>

      <Container className="my-16">
        <div className="mx-auto my-16">
          <Text
            portableText={description}
            className="mx-auto my-16"
            id={introId}
          />
          <span className="sr-only">The Committee</span>
          <CommitteeSignature aria-hidden className="mx-auto w-48" />
          <Affiliates />
        </div>

        <Sponsors heading="Sponsored by" className="mb-24" />
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
        <NewsList posts={news} hero />
        <div className="h-8" />
        <Link href="/news" arrow>
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
