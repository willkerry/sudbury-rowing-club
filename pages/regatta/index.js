import Container from "@/components/container";
import DayDateFormatter from "@/components/daydate-formatter";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import {
  ContactIcon,
  EntriesIcon,
  EventsIcon,
  InfoIcon,
  ResultsIcon,
} from "@/components/regatta/icons";
import Hero from "@/components/stour/hero";
import Masonry from "@/components/stour/masonry";
import Note from "@/components/stour/note";
import Skeleton from "@/components/stour/skeleton";
import Text from "@/components/stour/text";
import rawData from "@/data/regatta.json";
import { Disclosure, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import ordinal from "ordinal";
import { ChevronDown, Zap } from "react-feather";

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
  function DetailsSection({ data }) {
    return (
      <div className="p-6 space-y-3 border bg-gray-50 rounded-2xl">
        <h3 className="pb-1.5 flex items-center">
          <Zap className="inline w-4 h-4 mr-1 text-blue-500 transform rotate-180" />
          <div className="text-sm font-medium tracking-wider text-gray-500 uppercase">
            Quick information
          </div>
        </h3>
        <Details summary="Events" icon={<EventsIcon />}>
          <Events data={races} coursemap={courseMap} />
        </Details>
        <Details summary="Entries" icon={<EntriesIcon />}>
          <Entries>{data.entries.text}</Entries>
        </Details>
        <Details summary="Results" icon={<ResultsIcon />}>
          <Results data={data} tab />
        </Details>
        <Details summary="Important" icon={<InfoIcon />}>
          <CompetitorInformation tab />
        </Details>
        <Details summary="Contact" icon={<ContactIcon />}>
          <div className="max-w-md mx-auto">
            <ContactForm />
          </div>
        </Details>
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Sudbury Rowing Club Regatta, the ’International’</title>
      </Head>
      <HeroTitle title="The Sudbury Regatta" />
      <Container>
        <div className="py-20">
          <Hero
            title={intro.title}
            label={<DayDateFormatter dateString={intro.date} />}
          />
          <div className="pt-10 space-y-3 max-w-prose">
            <Note label="2021 Update" className="mb-6">
              We are delighted to confirm that we are planning to hold our
              regatta, ‘The International’ on Saturday 7 August 2021. We are
              still working on the changes we will need to put in place in
              response to the pandemic so watch this space.
            </Note>
            <Text markdown className="py-10">
              {intro.description}
            </Text>
            <Note type="success" label={intro.note.title}>
              {intro.note.text}
            </Note>
          </div>
        </div>
      </Container>

      <Container className="my-10">
        <DetailsSection data={data} />
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
function Details(props) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left bg-white border rounded-lg hover:border-gray-400 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-4 text-gray-500">{props.icon}</div>
              <div className="text-base text-gray-800">{props.summary}</div>
              <ChevronDown
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-gray-400 ml-2`}
              />
            </div>
          </Disclosure.Button>
          <div className="overflow-hidden">
            <Transition
              enter="transition ease-in-out duration-300 transform-gpu origin-top"
              enterFrom="-translate-y-full opacity-0"
              enterTo="translate-y-0  opacity-100"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="-translate-y-full opacity-0"
            >
              <Disclosure.Panel className="py-6">
                {props.children}
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  );
}
