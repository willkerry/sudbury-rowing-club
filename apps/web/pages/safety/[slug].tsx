import type { ParsedUrlQuery } from "node:querystring";
import TextPage from "@/components/layouts/text-page";
import Text from "@/components/stour/text";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/constants";
import { fetchSafety, fetchSafetyById } from "@sudburyrc/api";
import { Download, ExternalLink } from "lucide-react";
import type { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";

export const getStaticProps = async ({
  params,
}: {
  params: ParsedUrlQuery;
}) => ({
  props: {
    item: await fetchSafetyById(params.slug as string),
  },
});

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await fetchSafety();

  return {
    paths: paths.map(({ _id }) => ({ params: { slug: _id } })),
    fallback: true,
  };
};

const SafetyItem: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  item,
}) => {
  if (!item) return null;

  return (
    <TextPage
      title={item.title}
      description="A safety page"
      color="transparent"
    >
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
    </TextPage>
  );
};

export default SafetyItem;
