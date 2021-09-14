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
import rawData from "@/data/regatta.json";
import { BASE_URL } from "@/lib/constants";
import { CalendarIcon, MapIcon } from "@heroicons/react/outline";
import { format, parseISO } from "date-fns";
import { EventJsonLd, NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import ordinal from "ordinal";
import Image from "next/image";
import Label from "@/components/stour/label";

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

export const getStaticProps = async () => {
  const data = await rawData;
  return {
    props: {
      data: data,
      intro: data.regattaIntro,
      testimonials: data.praise.year,
      races: data.events.event,
      courseMap: data.events.coursemap,
    },
    revalidate: 60,
  };
};

export default function Regatta({
  data,
  intro,
  testimonials,
  races,
  courseMap,
}) {
  const regattaDate = (
    <time dateTime={intro.date}>
      {format(parseISO(intro.date), "EEEE d LLLL yyyy")}
    </time>
  );
  const ticketItems = [
    {
      label: "Event",
      value: intro.title,
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
  const galleryImages = [
    {
      src: "/assets/regatta/landing/gallery/regatta1600x900.jpg",
      width: 1600,
      height: 900,
    },
    {
      src: "/assets/regatta/landing/gallery/regatta1920x1278.jpg",
      width: 1920,
      height: 1278,
    },
    {
      src: "/assets/regatta/landing/gallery/regatta2560x1707.jpg",
      width: 2560,
      height: 1707,
    },
    {
      src: "/assets/regatta/landing/gallery/regatta768x576.jpg",
      width: 768,
      height: 576,
    },
    {
      src: "/assets/regatta/landing/gallery/regatta960x512.jpg",
      width: 960,
      height: 512,
    },
    {
      src: "/assets/regatta/landing/gallery/regatta960x720.jpg",
      width: 960,
      height: 720,
    },
    {
      src: "/assets/regatta/landing/gallery/regatta1024x683.jpg",
      width: 1024,
      height: 683,
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
        name={intro.title}
        startDate={intro.date}
        endDate={intro.date}
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
        <RegattaHero
          ticketItems={ticketItems}
          subtitle="The Sudbury Regatta takes place on the first Saturday of August each year."
        />
        <DateLocation
          date={regattaDate}
          location="Friars Meadow, Sudbury, CO10 2TL"
        />
        <RegattaHeroImage
          title={
            <>
              The best <br />
              little regatta <br />
              in the world.
            </>
          }
          subtitle="according to a 2019 competitor."
        />
      </Container>

      <Container>
        <div className="flex gap-12 my-14">
          <div className="space-y-3 max-w-prose md:w-3/4">
            {/* <Note label="2021 Update" className="mb-6">
              We are delighted to confirm that we are planning to hold our
              regatta, ‘The International’ on Saturday 7 August 2021. We are
              still working on the changes we will need to put in place in
              response to the pandemic so watch this space.
            </Note> */}
            <Text markdown>{intro.description}</Text>
            <Note type="success" label={intro.note.title}>
              {intro.note.text}
            </Note>
            <div className="h-5" />
            <Details
              items={[
                {
                  summary: "Events",
                  icon: <EventsIcon />,
                  content: <Events data={races} coursemap={courseMap} />,
                },
                {
                  summary: "Entries",
                  icon: <EntriesIcon />,
                  content: (
                    <Entries
                      table={data.entries.waves}
                      categories={data.entries.categories}
                    >
                      {data.entries.text}
                    </Entries>
                  ),
                },
                {
                  summary: "Results",
                  icon: <ResultsIcon />,
                  content: <Results data={data} tab />,
                },
                {
                  summary: "Important",
                  icon: <InfoIcon />,
                  content: <CompetitorInformation tab />,
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
          {galleryImages.map((image, index) => (
            <figure key={index} className="flex flex-col">
              <Image
                src={image.src}
                width={(image.width / image.height) * 300}
                height={300}
                alt=""
                className="rounded"
              />
              <figcaption className="mt-1 text-sm text-gray-800">
                caption
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
          return (
            <div key={index} className="mb-24">
              <Masonry cols="3">
                <div className="py-24">
                  <h3 className="text-xl font-medium">
                    Praise for the {ordinal(item.number)} regatta{" "}
                  </h3>
                  <Label className="text-xs">{regattaDate}</Label>
                </div>
                {item.items.map((testimonial) => {
                  return (
                    <Testimonial
                      key={testimonial.text}
                      name={testimonial.name}
                      organisation={testimonial.club}
                    >
                      {testimonial.text}
                    </Testimonial>
                  );
                })}
              </Masonry>
            </div>
          );
        })}
      </Container>
    </Layout>
  );
}

function Asides({ item, index }) {
  return (
    <div>
      {aside.map((item, index) => (
        <div key={index}>
          <item.icon />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
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
