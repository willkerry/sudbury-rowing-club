import { fetchSafety, fetchSafetyById } from "@sudburyrc/api";
import { Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Text } from "@/components/stour/text";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";

type SafetyPageParams = { slug: string };
type SafetyPageParamObject = { params: Promise<SafetyPageParams> };

export const generateStaticParams = async (): Promise<SafetyPageParams[]> => {
  const paths = await fetchSafety();

  return paths.map(({ _id }) => ({ slug: _id }));
};

export const generateMetadata = async ({
  params,
}: SafetyPageParamObject): Promise<Metadata> => {
  const item = await fetchSafetyById((await params).slug);

  if (!item) return {};

  const { title } = item;

  return createMetadata({ title });
};

const SafetyItem = async ({ params }: SafetyPageParamObject) => {
  const item = await fetchSafetyById((await params).slug);

  if (!item) return notFound();

  return (
    <>
      <Text className="mb-12" portableText={item.body || []} />

      {item.link && (
        <Button
          asChild
          icon={
            item.link.url.includes(BASE_URL) ? <Download /> : <ExternalLink />
          }
        >
          <a href={item.link.url}>{item.link.title}</a>
        </Button>
      )}
      {item.document && (
        <Button asChild icon={<Download />}>
          <a href={`${item.document.url}?dl=`}>{item.document.title}</a>
        </Button>
      )}
    </>
  );
};

export default SafetyItem;
