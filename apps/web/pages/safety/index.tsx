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
import { fetchSafety } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import DateFormatter from "@/components/utils/date-formatter";

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
        images: [{ url: makeShareImageURL("Safety 🛟", true) }],
      }}
    />

    <HeroTitle prose title="Safety" />

    <Container className="mx-auto my-12 max-w-prose space-y-16">
      <SafetyCard />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {safety.map((item) => {
          const isEmergency = item.title.toLowerCase().includes("emergency");

          return (
            <div key={item._id} id={item._id} data-updated-at={item._updatedAt}>
              <div
                className={`rounded-lg border p-2 ${
                  isEmergency ? "border-red-300" : "bg-white"
                }`}
              >
                <div className="mb-2 text-xs font-medium text-gray-500">
                  Updated on <DateFormatter dateString={item._updatedAt} />
                </div>

                <h2 className="mb-2 line-clamp-1 font-semibold leading-tight tracking-tight text-gray-800 md:pr-6">
                  {item.title}
                </h2>

                {item.body && (
                  <Text
                    portableText={item.body.slice(0, 1)}
                    className="prose-sm mb-4"
                  />
                )}

                <div className="space-y-2">
                  {item.link && (
                    <Button
                      href={item.link.url}
                      as="a"
                      size="small"
                      className="w-full"
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
                      className="w-full"
                      size="small"
                    >
                      {item.document.title}
                    </Button>
                  )}
                  {(item.body?.length || 0) > 0 && (
                    <Button
                      as="a"
                      href={`safety/${item._id}`}
                      size="mini"
                      variant={isEmergency ? "error" : "brand"}
                      className="w-full"
                    >
                      Read more
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  </Layout>
);

export default Safety;
