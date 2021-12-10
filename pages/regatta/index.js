import Container from "@/components/container";
import DayDateFormatter from "@/components/daydate-formatter";
import Layout from "@/components/layout";
import {
  EntriesIcon,
  EventsIcon,
  InfoIcon,
  ResultsIcon,
} from "@/components/regatta/icons";
import Hero from "@/components/stour/hero";
import Loading from "@/components/stour/loading";
import { BASE_URL } from "@/lib/constants";
import { sanityClient } from "@/lib/sanity.server";
import groq from "groq";
import { EventJsonLd, NextSeo } from "next-seo";
import dynamic from "next/dynamic";

import DateLocation from "@/components/regatta/landing-page/date-location";
import Text from "@/components/stour/text";

const Gallery = dynamic(
  () => import("@/components/regatta/landing-page/gallery"),
  {
    loading: () => Loading(),
  }
);
const Details = dynamic(() =>
  import("@/components/regatta/landing-page/details")
);
const RegattaHero = dynamic(() =>
  import("@/components/regatta/landing-page/regatta-hero")
);
const RegattaHeroImage = dynamic(() =>
  import("@/components/regatta/landing-page/regatta-hero-image")
);
const Testimonials = dynamic(() =>
  import("@/components/regatta/landing-page/testimonials")
);
const Note = dynamic(() => import("@/components/stour/note"));
const Results = dynamic(() => import("@/components/regatta/results"), {
  loading: () => Loading(),
});
const Entries = dynamic(() => import("@/components/regatta/entries"), {
  loading: () => Loading(),
});
const Events = dynamic(() => import("@/components/regatta/events"), {
  loading: () => Loading(),
});
const CompetitorInformation = dynamic(
  () => import("@/components/regatta/competitor-information"),
  {
    loading: () => Loading(),
  }
);
const ContactForm = dynamic(() => import("@/components/contact-form"), {
  loading: () => Loading(),
});

export default function Regatta({ page, testimonials, results }) {
  const regattaDate = <DayDateFormatter dateString={page.date} />;
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
  const accordion = [
    {
      summary: "Events",
      icon: <EventsIcon />,
      content: <Events data={page.events} />,
    },
    {
      summary: "Entries",
      icon: <EntriesIcon />,
      content: (
        <Entries
          table={page.entries.waves.rows.map((row) => row.cells)}
          caption={page.entries.caption}
          waveNames={page.entries.waveNames}
        >
          <Text portableText>{page.entries.description}</Text>
        </Entries>
      ),
    },
    {
      summary: "Results",
      icon: <ResultsIcon />,
      content: (
        <Results results={results} tab>
          <Text portableText lead>
            {page.results.description}
          </Text>
        </Results>
      ),
    },
    {
      summary: "Important",
      icon: <InfoIcon />,
      content: (
        <CompetitorInformation
          tab
          description={page.competitorInformation.description}
          items={page.competitorInformation.documents}
        />
      ),
    },
    /* {
      summary: "Contact",
      icon: <ContactIcon />,
      content: (
        <div className="max-w-md mx-auto">
          <ContactForm />
        </div>
      ),
    }, */
  ];
  return (
    <Layout>
      <NextSeo
        title="Sudbury Rowing Club Regatta, the ’International’"
        description="The best little regatta in the world."
        openGraph={{
          title: "Sudbury Rowing Club Regatta, the ’International’",
          description: "The best little regatta in the world.",
          images: [{ url: BASE_URL + "/assets/og/regatta.png" }],
        }}
      />
      <EventJsonLd
        name={page.title}
        startDate={page.date}
        endDate={page.date}
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
        images={[BASE_URL + "/assets/og/regatta.png"]}
        description="The best little regatta in the world."
      />

      <Container>
        {page.note.display && (
          <Note
            label={page.note.label}
            centered
            className="mb-6"
            type={page.note.type !== "" ? page.note.type : "primary"}
          >
            {page.note.text}
          </Note>
        )}
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
          src={page.landingPage.heroImage.image.id}
          blurDataURL={page.landingPage.heroImage.image.lqip}
          title={page.landingPage.heroImage.heading}
          subtitle={page.landingPage.heroImage.subheading}
        />
      </Container>
      <Container className="my-24 max-w-prose">
        <Text portableText lead>
          {page.landingPage.description}
        </Text>
        <div className="h-5" />
        <Details items={accordion} />
      </Container>
      <Gallery imagesArray={page.landingPage.images} />

      <Hero
        title="Some of the people who’ve come to our regatta have said lovely things about it"
        label="Feedback"
        fullwidth
      />
      <Container>
        <Testimonials data={testimonials} />
      </Container>
    </Layout>
  );
}

export const getStaticProps = async () => {
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
            'id': asset->_id,
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
    note,
    competitorInformation { 
      description,
      documents[]
      {	title,
        "extension": asset->extension,
        "url": asset->url,
        "_id": asset->_id
        
      }
    },
    entries,
    results,
    "events": events.events,
  }} 
  + 
  {"testimonials": *[_type == "regattas" && testimonials != null && !(_id in path("drafts.**"))] | order(date desc) {date, testimonials, number}}
  + 
  {"results": *[_type == "regattas" && results != "" && !(_id in path("drafts.**")) ] | order(date desc){_id, date, results, number}}
  `);
  return {
    props: {
      page: page.page,
      testimonials: page.testimonials,
      results: page.results,
    },
    revalidate: 7200,
  };
};
