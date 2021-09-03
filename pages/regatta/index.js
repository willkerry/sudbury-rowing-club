import Container from "@/components/container";
import DayDateFormatter from "@/components/daydate-formatter";
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
import Skeleton from "@/components/stour/skeleton";
import rawData from "@/data/regatta.json";
import { BASE_URL } from "@/lib/constants";
import { EventJsonLd } from "next-seo";
import dynamic from "next/dynamic";
import Head from "next/head";
import ordinal from "ordinal";

const RegattaHeroImage = dynamic(() =>
  import("@/components/regatta/landing-page/regatta-hero-image")
);
const Note = dynamic(() => import("@/components/stour/note"));
const Text = dynamic(() => import("@/components/stour/text"));
const Masonry = dynamic(() => import("@/components/stour/masonry"));
const Results = dynamic(() => import("@/components/regatta/results"), {
  loading: () => Skeleton(),
});
const Entries = dynamic(() => import("@/components/regatta/entries"), {
  loading: () => Skeleton(),
});
const Events = dynamic(() => import("@/components/regatta/events"), {
  loading: () => Skeleton(),
});
const CompetitorInformation = dynamic(
  () => import("@/components/regatta/competitor-information"),
  {
    loading: () => Skeleton(),
  }
);
const ContactForm = dynamic(() => import("@/components/contact-form"), {
  loading: () => Skeleton(),
});

const Testimonial = dynamic(() => import("@/components/stour/testimonial"), {
  loading: () => Skeleton(),
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
  const ticketItems = [
    {
      label: "Event",
      value: intro.title,
    },
    {
      label: "Date",
      value: <DayDateFormatter dateString={intro.date} />,
    },
    {
      label: "Location",
      value: "Friars Meadow, \nSudbury CO10 2TL",
    },
  ];
  return (
    <Layout>
      <Head>
        <title>Sudbury Rowing Club Regatta, the ’International’</title>
      </Head>
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
        images={[BASE_URL + "/assets/regatta/landing/drone.jpg"]}
        description="The best little regatta in the world."
      />
      <Container>
        <RegattaHero
          ticketItems={ticketItems}
          subtitle="The Sudbury Regatta takes place on the first Saturday of August each year."
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
          </div>
          <div className="px-4 py-2 -mt-2 border rounded-lg">
            <h3 className="mb-5 text-sm font-medium leading-7 tracking-widest text-gray-500 uppercase">
              At a glance
            </h3>
            <dl className="">
              {[
                {
                  label: "Date",
                  value: <DayDateFormatter dateString={intro.date} />,
                },
                {
                  label: "Location",
                  value: (
                    <Link href="/contact/how-to-find-us">Sudbury CO10 2TL</Link>
                  ),
                },
                {
                  label: "Spectator Admission",
                  value: "Free",
                },
                {
                  label: "Competitor Entries",
                  value: (
                    <>
                      Via BROE. <Link href="/contact">Enquiries</Link>.
                    </>
                  ),
                },

                {
                  label: "Parking",
                  value: "Temporary event parking on Friars Meadow (paid)",
                },
              ].map((item, index) => (
                <>
                  <dt className="mt-3 text-xs font-semibold leading-7 tracking-wider text-gray-500 uppercase align-baseline">
                    {item.label}
                  </dt>
                  <dd className="mb-5 leading-7">{item.value}</dd>
                </>
              ))}
            </dl>
          </div>
        </div>
      </Container>
      <Container className="my-10">
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
              content: <Entries>{data.entries.text}</Entries>,
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
      </Container>
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
                  <div className="text-xs font-medium tracking-widest uppercase opacity-70">
                    <DayDateFormatter dateString={item.date} />
                  </div>
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
