import TextPage from "@/components/layouts/text-page";
import { createMetadata } from "@/lib/create-metadata";
import { notFound } from "next/navigation";
import { getSlugifiedRecords } from "../transformRecords";
import { formatDescription } from "./format-description";
import { RecordHolderList } from "./record-holder-list";
import { RecordTime } from "./record-time";

type Param = { event: string };

export const generateMetadata = async ({
  params,
}: {
  params: Promise<Param>;
}) => {
  const { event } = await params;
  const records = getSlugifiedRecords(event);

  if (!records || records.length === 0) {
    return;
  }

  return createMetadata({
    title: `Course record for ${records[0].event}`,
    description: formatDescription(records),
    publishedTime: records[0].year.toISOString(),
    type: "article",
  });
};

export const generateStaticParams = async (): Promise<Param[]> => {
  const records = getSlugifiedRecords();

  return records.map((record) => ({
    event: record.event,
  }));
};

const Page = async ({
  params,
}: {
  params: Promise<Param>;
}) => {
  const { event } = await params;

  const records = getSlugifiedRecords(event);

  if (!records || records.length === 0) {
    return notFound();
  }

  const eventName = records[0].event;
  const time = records[0].time;

  const description = formatDescription(records);

  return (
    <TextPage title={eventName} color="transparent">
      <RecordTime time={time} />
      <RecordHolderList records={records} />

      <p>{description}</p>
    </TextPage>
  );
};

export default Page;
