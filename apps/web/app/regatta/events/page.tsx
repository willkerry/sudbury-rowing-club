import { Container } from "@/components/layouts/container";
import { Events as EventsComponent } from "@/components/regatta/events";
import { PageHeader } from "@/components/stour/hero/page-header";
import { createMetadata } from "@/lib/create-metadata";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";

export const metadata = createMetadata({
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
      <PageHeader title="Event information" breadcrumbs />
      <Container className="mb-12">
        <EventsComponent data={events} />
      </Container>
    </>
  );
};

export default EventsPage;
