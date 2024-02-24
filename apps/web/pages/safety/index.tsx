import React from "react";
import { type InferGetStaticPropsType } from "next";
import { NextSeo } from "next-seo";
import { fetchSafety } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import SafetyCard from "@/components/safety";
import { SafetyItemCard } from "@/components/safety/safety-item-card";
import HeroTitle from "@/components/stour/hero/hero-title";

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
        {safety.map((item) => (
          <SafetyItemCard key={item._id} {...item} />
        ))}
      </div>
    </Container>
  </Layout>
);

export default Safety;
