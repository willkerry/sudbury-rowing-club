import type { InferGetStaticPropsType, NextPage } from "next";
import { EventJsonLd, NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import { fetchRegattaSettings, fetchRegattas } from "@sudburyrc/api";
import { REGATTA } from "@/lib/constants";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import {
  EntriesIcon,
  EventsIcon,
  InfoIcon,
  ResultsIcon,
} from "@/components/regatta/icons";
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

export const getStaticProps = async () => ({
  props: {
    ...(await fetchRegattaSettings()),
    regattas: await fetchRegattas(),
  },
});

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

const RegattaPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  competitorInformation,
  date,
  entries,
  events,
  landingPage,
  results,
  title,
  regattas,
}) => {
  const regattaDate = <DateFormatter dateString={date} format="long" />;

  const ticketItems: [string, string | JSX.Element][] = [
    ["Event", title],
    ["Date", regattaDate],
    ["Location", `${VENUE},\n${TOWN} ${POSTCODE}`],
  ];

  const accordion: DetailProps[] = [
    {
      summary: "Events",
      icon: <EventsIcon aria-hidden />,
      children: <Events data={events} />,
    },
    {
      summary: "Entries",
      icon: <EntriesIcon aria-hidden />,
      children: (
        <Entries
          table={
            entries.waves?.rows.map((row) => row.cells.map((cell) => cell)) || [
              [],
            ]
          }
          caption={entries.wavesCaption}
          waveNames={entries.waveNames}
        >
          <Text portableText={entries.description || []} />
        </Entries>
      ),
    },
    {
      summary: "Results",
      icon: <ResultsIcon aria-hidden />,
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
          <Text portableText={results.description || []} />
        </Results>
      ),
    },
    {
      summary: "Important",
      icon: <InfoIcon aria-hidden />,
      children: (
        <CompetitorInformation
          tab
          description={competitorInformation.description}
          items={competitorInformation.documents}
        />
      ),
    },
  ];

  return (
    <Layout>
      <NextSeo
        title={EVENT_NAME_LONG}
        description={EVENT_TAGLINE}
        openGraph={{
          title: EVENT_NAME_LONG,
          description: EVENT_TAGLINE,
          images: [{ url: OG_IMAGE_URL }],
        }}
      />
      <EventJsonLd
        name={title}
        startDate={date}
        endDate={date}
        location={{
          name: VENUE,
          address: {
            streetAddress: `${VENUE}, ${STREET}`,
            addressLocality: TOWN,
            addressRegion: COUNTY,
            postalCode: POSTCODE,
            addressCountry: "UK",
          },
        }}
        url={CANONICAL_URL}
        images={[OG_IMAGE_URL]}
        description={EVENT_TAGLINE}
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
    </Layout>
  );
};

export default RegattaPage;
