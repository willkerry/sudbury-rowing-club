import TextPage from "@/components/layouts/text-page";
import rawData from "@/data/regatta.json";

export const getStaticProps = async () => {
  const data = await rawData;
  return {
    props: {
      entryText: data.entries.text,
    },
    revalidate: 60,
  };
};

export default function Entries({ entryText }) {
  return (
    <TextPage title="Entry Information">
      <div dangerouslySetInnerHTML={{ __html: entryText }} />
    </TextPage>
  );
}
