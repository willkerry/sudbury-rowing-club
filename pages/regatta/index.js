import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import DayDateFormatter from "@/components/daydate-formatter";
import ordinal from "ordinal";
import Note from "@/components/stour/note";
import Text from "@/components/stour/text";
import Testimonial from "@/components/stour/testimonial";
import Masonry from "@/components/stour/masonry";
import Hero from "@/components/stour/hero";

import {
  ContactIcon,
  EntriesIcon,
  EventsIcon,
  InfoIcon,
  ResultsIcon,
} from "@/components/regatta-tabs/icons";

import DataTabs from "@/components/regatta-tabs/data-tabs";
import Events from "@/components/regatta-tabs/events";
import Entries from "@/components/regatta-tabs/entries";
import Results from "@/components/regatta-tabs/results";

import data from "@/data/regatta.json";

console.log(data.results.results);

const tabData = [
  {
    label: "Events",
    content: (
      <Events data={data.events.event} coursemap={data.events.coursemap} />
    ),
    icon: <EventsIcon />,
  },
  {
    label: "Entries",
    content: <Entries>{data.entries.text}</Entries>,
    icon: <EntriesIcon />,
  },
  {
    label: "Results",
    content: (
      <Results
        results={data.results.results}
        record={data.results.courseRecords}
      />
    ),
    icon: <ResultsIcon />,
  },
  {
    label: "Important",
    content: <Entries>{data.entries.text}</Entries>,
    icon: <InfoIcon />,
  },
  {
    label: "Contact",
    content: <Entries>{data.entries.text}</Entries>,
    icon: <ContactIcon />,
  },
];

export default function Regatta() {
  return (
    <Layout>
      <Head>
        <title>Regatta</title>
      </Head>
      <HeroTitle title="The Sudbury Regatta" />
      <Container>
        <div className="py-20">
          <Hero
            title={data.regattaIntro.title}
            label={<DayDateFormatter dateString={data.regattaIntro.date} />}
          />
          <div className="pt-10 space-y-3 max-w-prose">
            <Note label="2021 Update" className="mb-6">
              We are delighted to confirm that we are planning to hold our
              regatta, ‘The International’ on Saturday 7 August 2021. We are
              still working on the changes we will need to put in place in
              response to the pandemic so watch this space.
            </Note>
            <Text markdown className="py-10">
              {data.regattaIntro.description}
            </Text>
            <Note type="success" label={data.regattaIntro.note.title}>
              {data.regattaIntro.note.text}
            </Note>
          </div>
        </div>
      </Container>
      <Container className="my-32">
        <DataTabs data={tabData} />
      </Container>
      <Hero
        title="Some of the people who’ve come to our regatta have said lovely things about it"
        label="Feedback"
        fullwidth
      />
      <Container>
        {data.praise.year.map((item, index) => {
          return (
            <div key={index}>
              <h3 className="pt-12 font-serif text-3xl font-medium">
                Praise for the {ordinal(item.number)} regatta{" "}
              </h3>
              <div className="pb-12 font-medium tracking-widest uppercase opacity-70">
                <DayDateFormatter dateString={item.date} />
              </div>

              <Masonry cols="3">
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
