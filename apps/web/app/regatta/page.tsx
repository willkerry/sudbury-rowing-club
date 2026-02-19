import { QueueListIcon } from "@heroicons/react/24/outline";
import { fetchRegattaSettings, fetchRegattas } from "@sudburyrc/api";
import { Award, BadgeAlert, TicketIcon, Timer } from "lucide-react";
import type { JSX } from "react";
import type { SportsEvent, WithContext } from "schema-dts";
import { logos as sponsors } from "@/components/landing/sponsors";
import { Container } from "@/components/layouts/container";
import { DateLocation } from "@/components/regatta/landing-page/date-location";
import type { DetailProps } from "@/components/regatta/landing-page/details";
import { Details } from "@/components/regatta/landing-page/details";
import { Gallery } from "@/components/regatta/landing-page/gallery";
import { RegattaHero } from "@/components/regatta/landing-page/regatta-hero";
import { RegattaHeroImage } from "@/components/regatta/landing-page/regatta-hero-image";
import { Testimonials } from "@/components/regatta/landing-page/testimonials";
import { Hero } from "@/components/stour/hero";
import { Text } from "@/components/stour/text";
import { DateFormatter } from "@/components/utils/date-formatter";
import { ClubJsonLd, REGATTA } from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";
import { getClub } from "@/lib/getClub";

const fetchRegattasAndSettings = async () => {
  const regattaSettings = await fetchRegattaSettings();
  const regattas = await fetchRegattas();

  const regattasWithTestimonials = regattas.map((regatta) => ({
    ...regatta,
    testimonials:
      regatta?.testimonials?.map((testimonial) => {
        const name = testimonial.club || testimonial.name;

        const probableClubName = name.split(", ")[1] || name;
        const club = getClub(probableClubName);

        if (!club) return testimonial;

        return {
          ...testimonial,
          clubBladeUrl: club.bladeUrl,
          clubHref: club.href,
          clubName: club.name,
        };
      }) || null,
  }));

  return {
    ...regattaSettings,
    regattas: regattasWithTestimonials,
  };
};

const {
  EVENT_NAME_LONG,
  EVENT_TAGLINE,
  OG_IMAGE_URL,
  CANONICAL_URL,
  VENUE,
  STREET,
  TOWN,
  COUNTY,
  POSTCODE,
  TESTIMONIAL_TITLE,
  TESTIMONIAL_DESCRIPTION,
} = REGATTA;

export const metadata = createMetadata({
  description: EVENT_TAGLINE,
  image: OG_IMAGE_URL,
  title: EVENT_NAME_LONG,
});

const RegattaPage = async () => {
  const { date, landingPage, title, regattas } =
    await fetchRegattasAndSettings();

  const regattaDate = <DateFormatter dateString={date} format="long" />;

  const ticketItems: [string, string | JSX.Element][] = [
    ["Event", title],
    ["Date", regattaDate],
    ["Location", `${VENUE},\n${TOWN} ${POSTCODE}`],
  ];

  const accordion: DetailProps[] = [
    {
      href: "./regatta/events",
      icon: <Award aria-hidden />,
      summary: "Events",
    },
    {
      href: "./regatta/entries",
      icon: <TicketIcon aria-hidden />,
      summary: "Entries",
    },
    {
      href: "./regatta/results",
      icon: <Timer aria-hidden />,
      summary: "Results",
    },
    {
      href: "./regatta/draw",
      icon: <QueueListIcon aria-hidden />,
      summary: "Draw",
    },
    {
      href: "./regatta/competitor-information",
      icon: <BadgeAlert aria-hidden />,
      summary: "Competitor Information",
    },
  ];

  const jsonLd: WithContext<SportsEvent> = {
    "@context": "https://schema.org",
    "@id": CANONICAL_URL,
    "@type": "SportsEvent",
    description: EVENT_TAGLINE,
    endDate: date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: OG_IMAGE_URL,
    isAccessibleForFree: true,
    name: EVENT_NAME_LONG,
    organizer: ClubJsonLd,
    sponsor: sponsors.map(({ href, name }) => ({
      "@type": "Organization",
      name,
      url: href,
    })),
    sport: "Rowing",
    startDate: date,
    url: CANONICAL_URL,
    location: {
      "@type": "Place",
      name: VENUE,
      address: {
        "@type": "PostalAddress",
        addressCountry: "UK",
        addressLocality: TOWN,
        addressRegion: COUNTY,
        postalCode: POSTCODE,
        streetAddress: `${VENUE}, ${STREET}`,
      },
    },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <Container>
        <RegattaHero {...{ ticketItems }} subtitle={landingPage.tagline} />
        <DateLocation
          date={regattaDate}
          location={`${VENUE}, ${TOWN}, ${POSTCODE}`}
        />
        <RegattaHeroImage
          aspectRatio={landingPage.heroImage.image.aspectRatio || 1}
          blurDataURL={landingPage.heroImage.image.lqip || ""}
          src={landingPage.heroImage.image._id}
          subtitle={landingPage.heroImage.subheading}
          title={landingPage.heroImage.heading}
        />
      </Container>
      <Container className="my-24 max-w-prose">
        <Text portableText={landingPage.description || []} />
        <div className="h-5" />

        <Details items={accordion} />
      </Container>

      <Gallery images={landingPage.images} />

      <div>
        <Hero
          fullwidth
          label={TESTIMONIAL_TITLE}
          title={TESTIMONIAL_DESCRIPTION}
        />

        <Container>
          <Testimonials {...{ regattas }} />
        </Container>
      </div>
    </>
  );
};

export default RegattaPage;
