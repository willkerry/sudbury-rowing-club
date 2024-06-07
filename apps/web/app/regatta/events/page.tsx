import groq from "groq";
import { sanityClient } from "@sudburyrc/api";
import { createMetaData } from "@/lib/create-metadata";
import Container from "@/components/layouts/container";
import EventsComponent from "@/components/regatta/events";
import HeroTitle from "@/components/stour/hero/hero-title";

export const metadata = createMetaData({
  title: "Event Information | Sudbury Regatta",
  description: "Races at the Sudbury Regatta.",
  image: { title: "Event Information" },
});

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

const EventsPage = async () => {
  const {
    events: { events },
  }: { events: { events: Event[] } } = await sanityClient.fetch(
    groq`*[_type == "regattaSettings"][0]{events}`,
  );

  return (
    <>
      <HeroTitle title="Event Information" breadcrumbs />
      <Container className="my-12">
        <EventsComponent data={events} />
      </Container>
    </>
  );
};

export default EventsPage;
