import Head from "next/head";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import CollapsibleCard from "@/components/stour/collapsible-card";
import fetchNotices from "@/lib/queries/fetch-notices";
import { InferGetStaticPropsType, NextPage } from "next";

export const getStaticProps = async () => ({
  props: { notices: await fetchNotices() },
  revalidate: 60,
});

const Notices: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  notices,
}) => (
  <Layout>
    <Head>
      <title>Members’ Notices</title>
    </Head>
    <HeroTitle prose title="Notices" transparent />
    <Container className="my-12 max-w-prose space-y-6">
      {notices.map((notice) => (
        <CollapsibleCard key={notice._id} {...{ notice }} />
      ))}
    </Container>
  </Layout>
);

export default Notices;
