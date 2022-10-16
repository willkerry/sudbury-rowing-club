import groq from "groq";
import TextPage from "@/components/layouts/text-page";
import EntriesComponent from "@/components/regatta/entries";
import { CompactEvents } from "@/components/regatta/events";
import Text from "@/components/stour/text";
import Link from "@/components/stour/link";
import sanityClient from "@/lib/sanity.server";
import type { PortableTextProps } from "@portabletext/react";
import type { Event } from "./events";
import { NextPage } from "next";

export type Entries = {
  caption?: string;
  description: PortableTextProps["value"];
  waveNames: string[];
  waves: string[][];
};

const Entries: NextPage<{
  entries: Entries;
  events: Event[];
}> = ({ entries, events }) => {
  return (
    <TextPage
      title="Entry Information"
      ogImage="/assets/og/entries.png"
      description="Details for competetive entry to the Sudbury Regatta."
    >
      <CompactEvents data={events} />
      <div className="space-x-4">
        <Link href="/regatta/events">More on events</Link>
        <Link href="/regatta/course">Course Map</Link>
      </div>
      <div className="h-16" />
      <EntriesComponent
        table={entries?.waves}
        caption={entries?.caption}
        waveNames={entries?.waveNames}
      >
        <Text lead portableText={entries.description} />
      </EntriesComponent>
    </TextPage>
  );
};

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`*[_type == "regattaSettings"][0]{entries, events}`
  );
  return {
    props: {
      entries: {
        caption: data.entries.wavesCaption,
        description: data.entries.description,
        waveNames: data.entries.waveNames,
        waves: data.entries.waves.rows.map((row: any) => row.cells),
      },
      events: data.events.events,
    },
  };
};

export default Entries;
