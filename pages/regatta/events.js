import Layout from "@/components/layout";
import { NextSeo } from "next-seo";
import HeroTitle from "@/components/hero-title";
import Container from "@/components/container";
import EventsComponent from "@/components/regatta/events";
import { BASE_URL } from "@/lib/constants";
import { sanityClient } from "@/lib/sanity.server";
import groq from "groq";

const og = {
  title: "Event Information",
  description: "Races at the Sudbury Regatta.",
};

export default function Entries({ data }) {
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
      <HeroTitle title={og.title} breadcrumbs prose />
      <Container className="my-12 max-w-prose">
        <EventsComponent data={data} />
      </Container>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`*[_type == "regattaSettings"][0]{events}`
  );
  return {
    props: { data: data.events.events },
    revalidate: 7200,
  };
};
