import { Download, ExternalLink } from "react-feather";
import { NextSeo } from "next-seo";
import { BASE_URL } from "lib/constants";
import SafetyCard from "@/components/safety";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Text from "@/components/stour/text";
import Button from "@/components/stour/button";
import { InferGetStaticPropsType } from "next";
import { fetchSafety } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import DateFormatter from "@/components/utils/date-formatter";
import Link from "@/components/stour/link";

export const getStaticProps = async () => {
  const safetyItems = await fetchSafety();

  const pinned = safetyItems.filter((item) => item.pin);
  const unpinned = safetyItems.filter((item) => !item.pin);

  return {
    props: { safety: [...pinned, ...unpinned] },
  };
};

const Safety = ({ safety }: InferGetStaticPropsType<typeof getStaticProps>) => (
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

                <Link
                  href={`safety/${item._id}`}
                  className="text-gray-900 transition hover:text-blue-500 hover:underline"
                >
                  <h2 className="tracking-tightmd:pr-6 mb-2 line-clamp-1 font-semibold leading-tight">
                    {item.title}
                  </h2>
                </Link>

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
