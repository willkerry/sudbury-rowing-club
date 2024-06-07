import { Download, ExternalLink } from "lucide-react";
import { fetchSafety, fetchSafetyById } from "@sudburyrc/api";
import { BASE_URL } from "@/lib/constants";
import Text from "@/components/stour/text";
import { Button } from "@/components/ui/button";

export const generateStaticParams = async () => {
  const paths = await fetchSafety();

  return paths.map(({ _id }) => ({ slug: _id }));
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
