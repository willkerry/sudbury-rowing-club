import TextPage from "@/components/layouts/text-page";
import { fetchSafety } from "@sudburyrc/api";
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import Text from "@/components/stour/text";
import { Download, ExternalLink } from "react-feather";
import Button from "@/components/stour/button";
import { BASE_URL } from "@/lib/constants";

export const getStaticProps = async ({
  params,
}: {
  params: ParsedUrlQuery;
}) => {
  const allSafetyItems = await fetchSafety();
  const thisSpecificSafetyItem = allSafetyItems.find(
    ({ _id }) => _id === params?.slug
  );

  return {
    props: {
      item: thisSpecificSafetyItem,
    },
  };
};

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
    <TextPage title={item.title} description="A safety page">
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
