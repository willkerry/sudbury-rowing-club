import TextPage from "@/components/layouts/text-page";
import EntriesComponent from "@/components/regatta/entries";
import { CompactEvents } from "@/components/regatta/events";
import Text from "@/components/stour/text";
import { createMetadata } from "@/lib/create-metadata";
import { fetchRegattaSettings } from "@sudburyrc/api";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Entry Information | Sudbury Rowing Club",
  description: "Details for competetive entry to the Sudbury Regatta.",
  image: { title: "Entry Information" },
});

const Entries = async () => {
  const { entries, events } = await fetchRegattaSettings();

  const table =
    entries?.waves?.rows?.map((row) => row?.cells?.map((cell) => cell)) || [];

  return (
    <TextPage title="Entry information" prose={false}>
      <div className="prose max-w-full">
        <CompactEvents data={events} />

        <div className="space-x-4">
          <Link href="/regatta/events">More on events</Link>
          <Link href="/regatta/course">Course Map</Link>
        </div>
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
