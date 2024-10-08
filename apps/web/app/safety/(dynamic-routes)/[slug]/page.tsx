import Text from "@/components/stour/text";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";
import { fetchSafety, fetchSafetyById } from "@sudburyrc/api";
import { Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const generateStaticParams = async () => {
  const paths = await fetchSafety();

  return paths.map(({ _id }) => ({ slug: _id }));
};

type Params = {
  params: Awaited<ReturnType<typeof generateStaticParams>>[number];
};

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const { title } = await fetchSafetyById(params.slug);

  return createMetadata({ title });
};

const SafetyItem = async ({ params }: { params: { slug: string } }) => {
  const item = await fetchSafetyById(params.slug);

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
