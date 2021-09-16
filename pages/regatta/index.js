import Container from "@/components/container";
import Layout from "@/components/layout";
import {
  ContactIcon,
  EntriesIcon,
  EventsIcon,
  InfoIcon,
  ResultsIcon,
} from "@/components/regatta/icons";
import Details from "@/components/regatta/landing-page/details";
import RegattaHero from "@/components/regatta/landing-page/regatta-hero";
import Hero from "@/components/stour/hero";
import Link from "@/components/stour/link";
import Loading from "@/components/stour/loading";
import { BASE_URL } from "@/lib/constants";
import { CalendarIcon, MapIcon } from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import { EventJsonLd, NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import ordinal from "ordinal";
import Image from "next/image";
import Label from "@/components/stour/label";

import { groq } from "next-sanity";
import { urlFor } from "@/lib/sanity";
import { sanityClient } from "@/lib/sanity.server";

const RegattaHeroImage = dynamic(() =>
  import("@/components/regatta/landing-page/regatta-hero-image")
);
const Note = dynamic(() => import("@/components/stour/note"));
const Text = dynamic(() => import("@/components/stour/text"));
const Masonry = dynamic(() => import("@/components/stour/masonry"));
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

const Testimonial = dynamic(() => import("@/components/stour/testimonial"), {
  loading: () => Loading(),
});

const pageQuery = groq`

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
      asset->,
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
      "_id": asset->_id,
      "size": asset->size
      
    }
  },
  courseMap {
    heading,
    description,
    "coursemap": map.asset->url,
    mapImage {
      'url':  asset->url,
      'aspectRatio': asset->metadata.dimensions.aspectRatio,
      'lqip': asset->metadata.lqip
    } 
  },
  entries,
  results,
  "events": events.events,
}} 
+ 
{"regattas": *[_type == "regattas"] | order(date desc) {date, results, number}}
+
{"testimonials": *[_type == "regattas"] | order(date desc) {date, testimonials, number}}
`;

export default function Regatta({ testimonials, page, regattas }) {
  const regattaDate = (
    <time dateTime={page.date}>
      {format(parseISO(page.date), "EEEE d LLLL yyyy")}
    </time>
  );
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
        {console.log(page.landingPage.heroImage.image)}
        <RegattaHeroImage
          aspectRatio={page.landingPage.heroImage.image.aspectRatio}
          src={page.landingPage.heroImage.image.id}
          blurDataURL={page.landingPage.heroImage.image.lqip}
          title={page.landingPage.heroImage.heading}
          subtitle={page.landingPage.heroImage.subheading}
        />
      </Container>

      <Container>
        <div className="flex gap-12 my-14">
          <div className="space-y-3 max-w-prose md:w-3/4">
            <Text portableText lead>
              {page.landingPage.description}
            </Text>
            <div className="h-5" />
            <Details
              items={[
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
                    <Results results={regattas} tab>
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
                {
                  summary: "Contact",
                  icon: <ContactIcon />,
                  content: (
                    <div className="max-w-md mx-auto">
                      <ContactForm />
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </Container>

      <div className="w-full overflow-x-scroll">
        <div className="flex gap-4 pr-4 m-4 min-w-max">
          {page.landingPage.images.map((image) => (
            <figure key={image.asset._id} className="flex flex-col">
              <Image
                src={urlFor(image).height(600).url()}
                width={300 * image.asset.metadata.dimensions.aspectRatio}
                height={300}
                placeholder="blur"
                blurDataURL={image.asset.metadata.lqip}
                alt={image.caption}
                className="rounded"
              />
              <figcaption className="mt-1 text-sm text-gray-800">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <Hero
        title="Some of the people who’ve come to our regatta have said lovely things about it"
        label="Feedback"
        fullwidth
      />
      <Container>
        {testimonials.map((item, index) => {
          return item.testimonials ? (
            <div key={index} className="mb-24">
              <Masonry cols="3">
                <div className="py-24">
                  <h3 className="text-xl font-medium">
                    Praise for the {ordinal(item.number)} regatta
                  </h3>
                  <Label>
                    <time dateTime={item.date}>
                      {format(parseISO(item.date), "EEEE d LLLL yyyy")}
                    </time>
                  </Label>
                </div>
                {item.testimonials.map((testimonial, index) => {
                  return (
                    <Testimonial
                      key={index}
                      name={testimonial.name}
                      organisation={testimonial.club}
                    >
                      {testimonial.text}
                    </Testimonial>
                  );
                })}
              </Masonry>
            </div>
          ) : null;
        })}
      </Container>
    </Layout>
  );
}

function DateLocation({ date, location }) {
  return (
    <div className="flex justify-center gap-6 my-8">
      <div className="flex items-center">
        <CalendarIcon className="inline-flex w-4 h-4 mr-1.5 text-gray-400" />
        <span className="text-sm text-gray-800">{date}</span>
      </div>
      <div className="flex items-center">
        <MapIcon className="inline-flex w-4 h-4 mr-1.5 text-gray-400" />
        <span className="text-sm text-gray-800">
          <Link href="/contact/how-to-find-us">{location}</Link>
        </span>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const page = await sanityClient.fetch(pageQuery);
  return {
    props: {
      page: page.page,
      regattas: page.regattas,
      testimonials: page.testimonials,
    },
    revalidate: 3600,
  };
};
