import { logos as sponsors } from "@/components/landing/sponsors";
import { Container } from "@/components/layouts/container";
import { DateLocation } from "@/components/regatta/landing-page/date-location";
import type { DetailProps } from "@/components/regatta/landing-page/details";
import { Testimonials } from "@/components/regatta/landing-page/testimonials";
import { Hero } from "@/components/stour/hero";
import Text from "@/components/stour/text";
import DateFormatter from "@/components/utils/date-formatter";
import { ClubJsonLd, REGATTA } from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";
import { getClub } from "@/lib/getClub";
import { fetchRegattaSettings, fetchRegattas } from "@sudburyrc/api";
import { Award, BadgeAlert, TicketIcon, Timer } from "lucide-react";
import type { JSX } from "react";
import type { SportsEvent, WithContext } from "schema-dts";
import { Details } from "@/components/regatta/landing-page/details";
import { Gallery } from "@/components/regatta/landing-page/gallery";
import { RegattaHero } from "@/components/regatta/landing-page/regatta-hero";
import { RegattaHeroImage } from "@/components/regatta/landing-page/regatta-hero-image";

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
  title: EVENT_NAME_LONG,
  description: EVENT_TAGLINE,
  image: OG_IMAGE_URL,
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
      summary: "Events",
      icon: <Award aria-hidden />,
      href: "./regatta/events",
    },
    {
      summary: "Entries",
      icon: <TicketIcon aria-hidden />,
      href: "./regatta/entries",
    },
    {
      summary: "Results",
      icon: <Timer aria-hidden />,
      href: "./regatta/results",
    },
    {
      summary: "Competitor Information",
      icon: <BadgeAlert aria-hidden />,
      href: "./regatta/competitor-information",
    },
  ];

  const jsonLd: WithContext<SportsEvent> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": CANONICAL_URL,
    isAccessibleForFree: true,
    sponsor: sponsors.map(({ href, name }) => ({
      "@type": "Organization",
      name,
      url: href,
    })),
    name: EVENT_NAME_LONG,
    startDate: date,
    endDate: date,
    location: {
      "@type": "Place",
      name: VENUE,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${VENUE}, ${STREET}`,
        addressLocality: TOWN,
        addressRegion: COUNTY,
        postalCode: POSTCODE,
        addressCountry: "UK",
      },
    },
    url: CANONICAL_URL,
    image: OG_IMAGE_URL,
    description: EVENT_TAGLINE,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    organizer: ClubJsonLd,
    sport: "Rowing",
  };

  return (
    <>
      <script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <RegattaHero {...{ ticketItems }} subtitle={landingPage.tagline} />
        <DateLocation
          date={regattaDate}
          location={`${VENUE}, ${TOWN}, ${POSTCODE}`}
        />
        <RegattaHeroImage
          aspectRatio={landingPage.heroImage.image.aspectRatio || 1}
          src={landingPage.heroImage.image._id}
          blurDataURL={landingPage.heroImage.image.lqip || ""}
          title={landingPage.heroImage.heading}
          subtitle={landingPage.heroImage.subheading}
        />
      </Container>
      <Container className="my-24 max-w-prose" id="regatta-body">
        <Text portableText={landingPage.description || []} />
        <div className="h-5" />

        <Details items={accordion} />
      </Container>

      <Gallery images={landingPage.images} />

      <div id="feedback">
        <Hero
          title={TESTIMONIAL_DESCRIPTION}
          label={TESTIMONIAL_TITLE}
          fullwidth
        />

        <Container>
          <Testimonials {...{ regattas }} />
        </Container>
      </div>
    </>
  );
};

export default RegattaPage;
