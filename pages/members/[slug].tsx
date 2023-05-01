import Head from "next/head";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import { NoticeBody } from "@/components/stour/collapsible-card/collapsible-card";
import {
  type GetStaticPaths,
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import {
  fetchNoticeSlugs,
  fetchOneNotice,
  type Notice as NoticeType,
} from "@/lib/queries/fetch-notices";

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetchNoticeSlugs();

  return {
    paths: slugs.map(({ slug }) => ({ params: { slug } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<{
  notice: NoticeType;
}> = async ({ params }) => ({
  props: { notice: await fetchOneNotice(params?.slug as string) },
  revalidate: 60,
});

const Notice: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  notice,
}) => (
  <Layout>
    <Head>
      <title>{notice?.title}</title>
    </Head>
    <HeroTitle prose title={notice?.title} transparent>
      <div className="h-2" />
      <Label>Members’ Notices</Label>{" "}
      <Link href="/members" arrow className="text-sm font-medium">
        View all
      </Link>
    </HeroTitle>
    <Container className="my-12 space-y-6 max-w-prose">
      <div className="overflow-hidden border divide-y rounded">
        <NoticeBody notice={notice} />
      </div>
    </Container>
  </Layout>
);

export default Notice;
