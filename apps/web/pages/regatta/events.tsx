import groq from "groq";
import { NextSeo } from "next-seo";
import Layout from "@/components/layouts/layout";
import HeroTitle from "@/components/stour/hero/hero-title";
import Container from "@/components/layouts/container";
import EventsComponent from "@/components/regatta/events";
import sanityClient from "@/lib/sanity.server";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { makeShareImageURL } from "@/lib/og-image";

const og = {
  title: "Event Information",
  description: "Races at the Sudbury Regatta.",
};

export type Event = {
  _key: string;
  title: string;
  description: string;
  course: string;
  categories: string;
  gender: string;
  boatClasses: string[];
  prizes: string;
};

export const getStaticProps: GetStaticProps = async () => {
  const { events }: { events: { events: Event[] } } = await sanityClient.fetch(
    groq`*[_type == "regattaSettings"][0]{events}`
  );
  return {
    props: {
      events: events.events,
    },
  };
};

const EventsPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  events,
}) => (
  <Layout>
    <NextSeo
      title={`${og.title} | Sudbury Regatta`}
      description={og.description}
      openGraph={{
        title: og.title,
        description: og.description,
        images: [{ url: makeShareImageURL(og.title, true) }],
      }}
    />
    <HeroTitle title={og.title} breadcrumbs prose />
    <Container className="my-12">
      <EventsComponent data={events} />
    </Container>
  </Layout>
);

export default EventsPage;
