import { notFound } from "next/navigation";
import TextPage from "@/components/layouts/text-page";
import { createMetadata } from "@/lib/create-metadata";
import { getResultBySlug, getSlugifiedRecords } from "../transformRecords";
import { formatDescription } from "./format-description";
import { RecordHolderList } from "./record-holder-list";
import { RecordTime } from "./record-time";
import { extendEventName } from "./utils";

type Param = { event: string };

export const generateMetadata = async ({
  params,
}: {
  params: Promise<Param>;
}) => {
  const { event } = await params;
  const records = getResultBySlug(event);

  if (!records || records.length === 0) {
    return;
  }

  const eventName = extendEventName(records[0].event);

  return createMetadata({
    description: formatDescription(records),
    publishedTime: records[0].year.toISOString(),
    title: `Course record for ${eventName}`,
    type: "article",
    image: {
      subtitle: "Course Record",
      title: eventName,
    },
  });
};

export const generateStaticParams = (): Param[] => {
  const records = getSlugifiedRecords();

  return records.map((record) => ({
    event: record.slug,
  }));
};

const Page = async ({ params }: { params: Promise<Param> }) => {
  const { event } = await params;

  const records = getResultBySlug(event);

  if (!records || records.length === 0) {
    return notFound();
  }

  const eventName = records[0].event;
  const time = records[0].time;

  const description = formatDescription(records);

  return (
    <TextPage prose="prose" title={extendEventName(eventName)}>
      <RecordTime time={time} />
      <RecordHolderList records={records} />

      <p>{description}</p>
    </TextPage>
  );
};

export default Page;
