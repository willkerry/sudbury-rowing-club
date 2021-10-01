import TextPage from "@/components/layouts/text-page";
import EntriesComponent from "@/components/regatta/entries";
import Text from "@/components/stour/text";
import { sanityClient } from "@/lib/sanity.server";
import groq from "groq";

export default function Entries({ data }) {
  return (
    <TextPage
      title="Entry Information"
      ogImage="/assets/og/entries.png"
      description="Details for competetive entry to the Sudbury Regatta."
    >
      <EntriesComponent
        table={data.waves.rows.map((row) => row.cells)}
        caption={data.caption}
        waveNames={data.waveNames}
      >
        <Text portableText lead>
          {data.description}
        </Text>
      </EntriesComponent>
    </TextPage>
  );
}

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`*[_type == "regattaSettings"][0]{entries}`
  );
  return {
    props: { data: data.entries },
    revalidate: 7200,
  };
};
