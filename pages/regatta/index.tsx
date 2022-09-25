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
import sanityClient from "@/lib/sanity.server";
import groq from "groq";
import { EventJsonLd, NextSeo } from "next-seo";
import dynamic from "next/dynamic";

import type { DetailProps } from "@/components/regatta/landing-page/details";
import type { NoteProps } from "@/components/stour/note/note";
import type { Testimonial } from "@/types/testimonial";
import { PortableTextProps } from "@portabletext/react";
import type { GetStaticProps } from "next";
import type { CompetitorInformation } from "./competitor-information";
import type { Entries } from "./entries";
import type { Event } from "./events";
import type { Result } from "./results";
import Notice from "@/components/regatta/notice";

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
interface ImageElement {
  _id: string;
  aspectRatio: number;
  bgColor?: null | string;
  caption?: string;
  color?: null | string;
  lqip?: string;
}
interface LandingPage {
  description: PortableTextProps["value"];
  heroImage: {
    heading: string;
    image: ImageElement;
    subheading: string;
  };
  images: ImageElement[];
  tagline: string;
}
export interface Page {
  competitorInformation: CompetitorInformation;
  date: Date;
  entries: Entries;
  events: Event[];
  landingPage: LandingPage;
  results: {
    description: PortableTextProps["value"];
    records: string;
  };
  title: string;
}

const RegattaPage = ({
  page,
  testimonials,
  results,
}: {
  page: Page;
  testimonials: Testimonial[];
  results: Result[];
}) => {
  const regattaDate = <DateFormatter dateString={page.date} format="long" />;
  const ticketItems = [
    {
      label: "Event",
      value: page.title,
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
      children: <Events data={page.events} />,
    },
    {
      summary: "Entries",
      icon: <EntriesIcon />,
      children: (
        <Entries
          table={page.entries.waves}
          caption={page.entries.caption}
          waveNames={page.entries.waveNames}
        >
          <Text portableText={page.entries.description} />
        </Entries>
      ),
    },
    {
      summary: "Results",
      icon: <ResultsIcon />,
      children: (
        <Results results={results} records={page.results.records} tab>
          <Text portableText={page.results.description} />
        </Results>
      ),
    },
    {
      summary: "Important",
      icon: <InfoIcon />,
      children: (
        <CompetitorInformation
          tab
          description={page.competitorInformation.description}
          items={page.competitorInformation.documents}
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
        name={page.title}
        startDate={page.date.toString()}
        endDate={page.date.toString()}
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
        <RegattaHero
          ticketItems={ticketItems}
          subtitle={page.landingPage.tagline}
        />
        <DateLocation
          date={regattaDate}
          location="Friars Meadow, Sudbury, CO10 2TL"
        />
        <RegattaHeroImage
          aspectRatio={page.landingPage.heroImage.image.aspectRatio}
          src={page.landingPage.heroImage.image._id}
          blurDataURL={page.landingPage.heroImage.image.lqip}
          title={page.landingPage.heroImage.heading}
          subtitle={page.landingPage.heroImage.subheading}
        />
      </Container>
      <Container className="my-24 max-w-prose" id="regatta-body">
        <Text portableText={page.landingPage.description} />
        <div className="h-5" />
        <Details items={accordion} />
      </Container>
      <Gallery images={page.landingPage.images} />
      <div id="feedback">
        <Hero
          title="Some of the people who’ve come to our regatta have said lovely things about it"
          label="Feedback"
          fullwidth
        />
        <Container>
          <Testimonials data={testimonials} />
        </Container>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const page = await sanityClient.fetch(groq`
  {"page": *[_type == "regattaSettings"][0] {
    title,
    date,
    landingPage {
      description,
      heroImage {
        heading,
        subheading,
          image {
            '_id': asset->_id,
            'aspectRatio': asset->metadata.dimensions.aspectRatio,
            'lqip': asset->metadata.lqip
          }
      },
      images[] {
        "_id": asset->_id,
        "aspectRatio": asset->metadata.dimensions.aspectRatio,
        "lqip": asset->metadata.lqip,
        "bgColor": asset->metadata.palette.darkMuted.background,
        "color": asset->metadata.palette.darkMuted.foreground,
        caption 
      },
      tagline
    },
    competitorInformation {
      description,
      documents[] { 
        title, 
        "extension": asset->extension,
        "url": asset->url,
        "_id": asset->_id
      }
    },
    entries,
    results,
    "events": events.events,
  }} +
  {"testimonials": *[_type == "regattas" && testimonials != null && !(_id in path("drafts.**"))] | order(date desc) {
    _id, date, testimonials, number
  }} +
  {"results": *[_type == "regattas" && results != "" && !(_id in path("drafts.**")) ] | order(date desc) {
    _id, date, results, number
   }}`);
  return {
    props: {
      page: {
        ...page.page,
        entries: {
          ...page.page.entries,
          waves: page.page.entries.waves.rows.map((row: any) => row.cells),
        },
      },
      testimonials: page.testimonials,
      results: page.results,
    },
  };
};

export default RegattaPage;
