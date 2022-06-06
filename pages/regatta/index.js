import { EventJsonLd, NextSeo } from "next-seo";
import PropTypes from "prop-types";
import groq from "groq";
import dynamic from "next/dynamic";
import Container from "@/components/layouts/container";
import DayDateFormatter from "@/components/utils/daydate-formatter";
import Layout from "@/components/layouts/layout";
import {
  EntriesIcon,
  EventsIcon,
  InfoIcon,
  ResultsIcon,
} from "@/components/regatta/icons";
import DateLocation from "@/components/regatta/landing-page/date-location";
import Hero from "@/components/stour/hero";
import Loading from "@/components/stour/loading";
import Text from "@/components/stour/text";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";

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
  {
    loading: () => <Loading />,
  }
);

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
          <Text portableText={page.entries.description} />
        </Entries>
      ),
    },
    {
      summary: "Results",
      icon: <ResultsIcon />,
      content: (
        <Results results={results} tab>
          <Text portableText={page.results.description} />
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
  ];
  return (
    <Layout>
      <NextSeo
        title="Sudbury Rowing Club Regatta, the ’International’"
        description="The best little regatta in the world."
        openGraph={{
          title: "Sudbury Rowing Club Regatta, the ’International’",
          description: "The best little regatta in the world.",
          imafes: [{ url: `${BASE_URL}/assets/og/regatta.png` }],
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
        images={[`${BASE_URL}/assets/og/regatta.png`]}
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
}

Regatta.propTypes = {
  page: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    landingPage: PropTypes.shape({
      description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.array,
      ]),
      tagline: PropTypes.string,
      heroImage: PropTypes.shape({
        heading: PropTypes.string,
        subheading: PropTypes.string,
        image: PropTypes.shape({
          id: PropTypes.string,
          aspectRatio: PropTypes.number,
          lqip: PropTypes.string,
        }),
      }),
      images: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          aspectRatio: PropTypes.number,
          lqip: PropTypes.string,
          bgColor: PropTypes.string,
          color: PropTypes.string,
          caption: PropTypes.string,
        })
      ),
    }),
    note: PropTypes.shape({
      display: PropTypes.bool,
      label: PropTypes.string,
      text: PropTypes.string,
      type: PropTypes.string,
    }),
    competitorInformation: PropTypes.shape({
      description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.array,
      ]),
      documents: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          url: PropTypes.string,
        })
      ),
    }),
    results: PropTypes.shape({
      description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.array,
      ]),
    }),
    events: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
      })
    ),
    entries: PropTypes.shape({
      caption: PropTypes.string,
      description: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.array,
      ]),
      waveNames: PropTypes.arrayOf(PropTypes.string),
      waves: PropTypes.shape({
        rows: PropTypes.arrayOf(
          PropTypes.shape({
            cells: PropTypes.arrayOf(PropTypes.string),
          })
        ),
      }),
    }),
  }).isRequired,
  testimonials: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

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
  {"testimonials": *[_type == "regattas" && testimonials != null && !(_id in path("drafts.**"))] | order(date desc) {_id, date, testimonials, number}}
  + 
  {"results": *[_type == "regattas" && results != "" && !(_id in path("drafts.**")) ] | order(date desc){_id, date, results, number}}
  `);
  return {
    props: {
      page: page.page,
      testimonials: page.testimonials,
      results: page.results,
    },
  };
};
