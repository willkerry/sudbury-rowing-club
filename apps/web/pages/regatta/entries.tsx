import TextPage from "@/components/layouts/text-page";
import EntriesComponent from "@/components/regatta/entries";
import { CompactEvents } from "@/components/regatta/events";
import Text from "@/components/stour/text";
import Link from "@/components/stour/link";
import type { InferGetStaticPropsType, NextPage } from "next";
import { fetchRegattaSettings } from "@sudburyrc/api";

export const getStaticProps = async () => ({
  props: await fetchRegattaSettings(),
});

const Entries: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  entries,
  events,
}) => {
  const table =
    entries?.waves?.rows?.map((row) => row?.cells?.map((cell) => cell)) || [];

  return (
    <TextPage
      title="Entry Information"
      description="Details for competetive entry to the Sudbury Regatta."
    >
      <CompactEvents data={events} />
      <div className="space-x-4">
        <Link href="/regatta/events">More on events</Link>
        <Link href="/regatta/course">Course Map</Link>
      </div>
      <div className="h-16" />
      <EntriesComponent
        {...{ table }}
        caption={entries?.wavesCaption}
        waveNames={entries?.waveNames}
      >
        <Text lead portableText={entries.description || []} />
      </EntriesComponent>
    </TextPage>
  );
};

export default Entries;
