import groq from "groq";
import PropTypes from "prop-types";
import TextPage from "@/components/layouts/text-page";
import EntriesComponent from "@/components/regatta/entries";
import Text from "@/components/stour/text";
import sanityClient from "@/lib/sanity.server";

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
Entries.propTypes = {
  data: PropTypes.shape({
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
    groq`*[_type == "regattaSettings"][0]{entries}`
  );
  return {
    props: { data: data.entries },
    revalidate: 7200,
  };
};
