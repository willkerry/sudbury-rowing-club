import { fetchRegattaSettings } from "@sudburyrc/api";
import Link from "next/link";
import TextPage from "@/components/layouts/text-page";
import { Entries as EntriesComponent } from "@/components/regatta/entries";
import { CompactEvents } from "@/components/regatta/events";
import { Text } from "@/components/stour/text";
import { createMetadata } from "@/lib/create-metadata";

export const metadata = createMetadata({
  description: "Details for competetive entry to the Sudbury Regatta.",
  image: { title: "Entry Information" },
  title: "Entry Information | Sudbury Rowing Club",
});

const Entries = async () => {
  const { entries, events } = await fetchRegattaSettings();

  const table =
    entries?.waves?.rows?.map((row) => row?.cells?.map((cell) => cell)) || [];

  return (
    <TextPage prose={false} title="Entry information">
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
