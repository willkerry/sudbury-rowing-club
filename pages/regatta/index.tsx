import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import {
  EntriesIcon,
  EventsIcon,
  InfoIcon,
  ResultsIcon,
} from "@/components/regatta/icons";
import DateLocation from "@/components/regatta/landing-page/date-location";
import Testimonials from "@/components/regatta/landing-page/testimonials";
import Hero from "@/components/stour/hero";
import Loading from "@/components/stour/loading";
import Text from "@/components/stour/text";
import DateFormatter from "@/components/utils/date-formatter";
import { BASE_URL } from "@/lib/constants";
import { EventJsonLd, NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Notice from "@/components/regatta/notice";
import fetchRegattas from "@/lib/queries/fetch-regattas";
import fetchRegattaSettings from "@/lib/queries/fetch-regatta-settings";

import type { DetailProps } from "@/components/regatta/landing-page/details";
import type { InferGetStaticPropsType, NextPage } from "next";
import type { CompetitorInformation } from "./competitor-information";

const Gallery = dynamic(
  () => import("@/components/regatta/landing-page/gallery"),
  { loading: () => <Loading /> }
);
const Details = dynamic(
  () => import("@/components/regatta/landing-page/details"),
  { loading: () => <Loading /> }
);
const RegattaHero = dynamic(
  () => import("@/components/regatta/landing-page/regatta-hero"),
  { loading: () => <Loading /> }
);
const RegattaHeroImage = dynamic(
  () => import("@/components/regatta/landing-page/regatta-hero-image"),
  { loading: () => <Loading /> }
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
  { loading: () => <Loading /> }
);

export const getStaticProps = async () => ({
  props: {
    ...(await fetchRegattaSettings()),
    regattas: await fetchRegattas(),
  },
});

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

  const ticketItems = [
    {
      label: "Event",
      value: title,
    },
    {
      label: "Date",
      value: regattaDate,
    },
    {
      label: "Location",
      value: "Friars Meadow, \nSudbury CO10 2TL",
    },
  ];
  const accordion: DetailProps[] = [
    {
      summary: "Events",
      icon: <EventsIcon />,
      children: <Events data={events} />,
    },
    {
      summary: "Entries",
      icon: <EntriesIcon />,
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
      icon: <ResultsIcon />,
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
      icon: <InfoIcon />,
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
        title="Sudbury Rowing Club Regatta, the ’International’"
        description="The best little regatta in the world."
        openGraph={{
          title: "Sudbury Rowing Club Regatta, the ’International’",
          description: "The best little regatta in the world.",
          images: [{ url: `${BASE_URL}/assets/og/regatta.png` }],
        }}
      />
      <EventJsonLd
        name={title}
        startDate={date}
        endDate={date}
        location={{
          name: "Friars Meadow",
          address: {
            streetAddress: "Friars Meadow, Edgeworth Road",
            addressLocality: "Sudbury",
            addressRegion: "Suffolk",
            postalCode: "CO10 2TL",
            addressCountry: "UK",
          },
        }}
        url="https://sudburyrowingclub.org.uk/regatta"
        images={[`${BASE_URL}/assets/og/regatta.png`]}
        description="The best little regatta in the world."
      />
      <Container>
        <Notice />
        <RegattaHero ticketItems={ticketItems} subtitle={landingPage.tagline} />
        <DateLocation
          date={regattaDate}
          location="Friars Meadow, Sudbury, CO10 2TL"
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
          title="Some of the people who’ve come to our regatta have said lovely things about it"
          label="Feedback"
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
