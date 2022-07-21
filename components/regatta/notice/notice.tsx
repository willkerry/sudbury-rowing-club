import Note from "@/components/stour/note";
import { PortableText } from "@portabletext/react";
import sanityClient from "@/lib/sanity.server";
import groq from "groq";
import useSWR from "swr";

const Notice = () => {
  const { data, error } = useSWR(
    groq`*[_type == "regattaSettings"][0]{note}`,
    (query) => sanityClient.fetch(query)
  );
  if (error) return <></>;
  if (!data) return <></>;
  if (!data?.note?.display) return <></>;
  return (
    <Note centered className="mb-6" type={data?.note?.type}>
      <PortableText value={data?.note?.text} />
    </Note>
  );
};

export default Notice;
