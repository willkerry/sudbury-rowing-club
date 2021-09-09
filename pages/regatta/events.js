import Layout from "@/components/layout";
import { NextSeo } from "next-seo";
import HeroTitle from "@/components/hero-title";
import Container from "@/components/container";
import rawData from "@/data/regatta.json";
import EventsComponent from "@/components/regatta/events";
import { BASE_URL } from "@/lib/constants";

export const getStaticProps = async () => {
  const data = await rawData;
  return {
    props: {
      races: data.events.event,
      courseMap: data.events.coursemap,
    },
    revalidate: 3600,
  };
};

const og = {
  title: "Event Information",
  description: "Races at the Sudbury Regatta.",
};

export default function Entries({ races, courseMap }) {
  return (
    <Layout>
      <NextSeo
        title={og.title + " | Sudbury Regatta"}
        description={og.description}
        openGraph={{
          title: og.title,
          description: og.description,
          images: [{ url: BASE_URL + "/assets/og/events.png" }],
        }}
      />
      <HeroTitle title={og.title} breadcrumbs />
      <Container className="my-12">
        <EventsComponent data={races} coursemap={courseMap} />
      </Container>
    </Layout>
  );
}
