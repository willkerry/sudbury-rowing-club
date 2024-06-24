import dynamic from "next/dynamic";
import { Award, BadgeAlert, TicketIcon, Timer } from "lucide-react";
import { fetchRegattaSettings, fetchRegattas } from "@sudburyrc/api";
import { REGATTA } from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";
import { getClub } from "@/lib/getClub";
import Container from "@/components/layouts/container";
import DateLocation from "@/components/regatta/landing-page/date-location";
import type { DetailProps } from "@/components/regatta/landing-page/details";
import Testimonials from "@/components/regatta/landing-page/testimonials";
import Hero from "@/components/stour/hero";
import Loading from "@/components/stour/loading";
import Text from "@/components/stour/text";
import DateFormatter from "@/components/utils/date-formatter";

const Gallery = dynamic(
  () => import("@/components/regatta/landing-page/gallery"),
  { loading: () => <Loading /> },
);
const Details = dynamic(
  () => import("@/components/regatta/landing-page/details"),
  { loading: () => <Loading /> },
);
const RegattaHero = dynamic(
  () => import("@/components/regatta/landing-page/regatta-hero"),
  { loading: () => <Loading /> },
);
const RegattaHeroImage = dynamic(
  () => import("@/components/regatta/landing-page/regatta-hero-image"),
  { loading: () => <Loading /> },
);
const Results = dynamic(() => import("@/components/regatta/results"), {
  loading: () => <Loading />,
});
const Entries = dynamic(() => import("@/components/regatta/entries"), {
  loading: () => <Loading />,
});
const Events = dynamic(() => import("@/components/regatta/events"), {
  loading: () => <Loading />,
});
const CompetitorInformation = dynamic(
  () => import("@/components/regatta/competitor-information"),
  { loading: () => <Loading /> },
);

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
  const {
    competitorInformation,
    date,
    entries,
    events,
    landingPage,
    results,
    title,
    regattas,
  } = await fetchRegattasAndSettings();

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
      children: <Events compact data={events} />,
    },
    {
      summary: "Entries",
      icon: <TicketIcon aria-hidden />,
      children: (
        <Entries
          table={
            entries.waves?.rows.map((row) => row.cells.map((cell) => cell)) || [
              [],
            ]
          }
          caption={entries.wavesCaption}
          waveNames={entries.waveNames}
          compact
        >
          <Text size="small" portableText={entries.description || []} />
        </Entries>
      ),
    },
    {
      summary: "Results",
      icon: <Timer aria-hidden />,
      children: (
        <Results
          results={
            regattas.map(({ _id, date, number, results }) => ({
              _id,
              date: new Date(date),
              number,
              results,
            })) || []
          }
          records={results.records}
          tab
        >
          <Text size="small" portableText={results.description || []} />
        </Results>
      ),
    },
    {
      summary: "Important",
      icon: <BadgeAlert aria-hidden />,
      children: (
        <CompetitorInformation
          tab
          description={competitorInformation.description}
          items={competitorInformation.documents}
        />
      ),
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
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
    images: [OG_IMAGE_URL],
    description: EVENT_TAGLINE,
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
