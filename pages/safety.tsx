import { Download, ExternalLink } from "react-feather";
import { NextSeo } from "next-seo";
import { BASE_URL } from "lib/constants";
import SafetyCard from "@/components/safety";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Text from "@/components/stour/text";
import Button from "@/components/stour/button";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import fetchSafety from "@/lib/queries/fetch-safety";

export const getStaticProps: GetStaticProps<{
  safety: Awaited<ReturnType<typeof fetchSafety>>;
}> = async () => ({
  props: {
    safety: await fetchSafety(),
  },
});

const Safety: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  safety,
}) => (
  <Layout>
    <NextSeo
      title="Safety | Sudbury Rowing Club"
      description="Rowing safely at Sudbury Rowing Club."
      openGraph={{
        title: "Safety",
        description: "Rowing safely at Sudbury Rowing Club.",
        images: [{ url: `${BASE_URL}/assets/og/safety.png` }],
      }}
    />

    <HeroTitle prose title="Safety" />

    <Container className="mx-auto my-12 space-y-16 max-w-prose">
      <SafetyCard />

      {safety.map((item) => (
        <div
          key={item._id}
          id={item._id}
          className="space-y-6"
          data-updated-at={item._updatedAt}
        >
          <h2 className="mb-8 text-xl font-bold tracking-tight text-gray-800 md:pr-6">
            {item.title}
          </h2>
          {item.body && <Text portableText={item.body} />}
          {item.link && (
            <Button
              href={item.link.url}
              as="a"
              icon={
                item.link.url.includes(BASE_URL) ? (
                  <Download />
                ) : (
                  <ExternalLink />
                )
              }
            >
              {item.link.title}
            </Button>
          )}
          {item.document && (
            <Button
              as="a"
              href={`${item.document.url}?dl=`}
              icon={<Download />}
            >
              {item.document.title}
            </Button>
          )}
        </div>
      ))}
    </Container>
  </Layout>
);

export default Safety;
