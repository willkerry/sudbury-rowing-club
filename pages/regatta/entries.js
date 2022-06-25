import groq from "groq";
import PropTypes from "prop-types";
import TextPage from "@/components/layouts/text-page";
import EntriesComponent from "@/components/regatta/entries";
import { CompactEvents } from "@/components/regatta/events";
import Text from "@/components/stour/text";
import sanityClient from "@/lib/sanity.server";

export default function Entries({ entries, events }) {
  return (
    <TextPage
      title="Entry Information"
      ogImage="/assets/og/entries.png"
      description="Details for competetive entry to the Sudbury Regatta."
    >
      <CompactEvents data={events} />
      <div className="h-16" />
      <EntriesComponent
        table={entries.waves.rows.map((row) => row.cells)}
        caption={entries.caption}
        waveNames={entries.waveNames}
      >
        <Text lead portableText={entries.description} />
      </EntriesComponent>
    </TextPage>
  );
}
Entries.propTypes = {
  entries: PropTypes.shape({
    waves: PropTypes.shape({
      rows: PropTypes.arrayOf(
        PropTypes.shape({
          cells: PropTypes.arrayOf(PropTypes.string.isRequired),
        })
      ),
    }),
    caption: PropTypes.string,
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
      PropTypes.node,
    ]),
    waveNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};
Entries.defaultProps = {
  data: {},
};

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`*[_type == "regattaSettings"][0]{entries, events}`
  );
  return {
    props: {
      entries: data.entries,
      events: data.events.events,
    },
  };
};
