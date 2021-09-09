import TextPage from "@/components/layouts/text-page";
import rawData from "@/data/regatta.json";
import EntriesComponent from "@/components/regatta/entries";

export const getStaticProps = async () => {
  const data = await rawData;
  return {
    props: {
      entryText: data.entries.text,
      wavetable: data.entries.waves,
      wavecategories: data.entries.categories,
    },
    revalidate: 60,
  };
};

export default function Entries({ entryText, wavetable, wavecategories }) {
  return (
    <TextPage
      title="Entry Information"
      ogImage="/assets/og/entries.png"
      description="Details for competetive entry to the Sudbury Regatta."
    >
      <EntriesComponent categories={wavecategories} table={wavetable}>
        {entryText}
      </EntriesComponent>
    </TextPage>
  );
}
