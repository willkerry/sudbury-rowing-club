import { Download, ExternalLink } from "react-feather";
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { fetchSafety, fetchSafetyById } from "@sudburyrc/api";
import { BASE_URL } from "@/lib/constants";
import TextPage from "@/components/layouts/text-page";
import Button from "@/components/stour/button";
import Text from "@/components/stour/text";

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
          href={item.link.url}
          as="a"
          icon={
            item.link.url.includes(BASE_URL) ? <Download /> : <ExternalLink />
          }
        >
          {item.link.title}
        </Button>
      )}
      {item.document && (
        <Button as="a" href={`${item.document.url}?dl=`} icon={<Download />}>
          {item.document.title}
        </Button>
      )}
    </TextPage>
  );
};

export default SafetyItem;
