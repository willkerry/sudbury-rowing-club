import {
  type GetStaticPaths,
  type GetStaticProps,
  type InferGetStaticPropsType,
  type NextPage,
} from "next";
import { NextSeo } from "next-seo";
import {
  type Notice as NoticeType,
  fetchNoticeSlugs,
  fetchOneNotice,
} from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { NoticeBody } from "@/components/stour/collapsible-card/collapsible-card";
import HeroTitle from "@/components/stour/hero/hero-title";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";

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
    <NextSeo
      title={notice?.title}
      openGraph={{
        images: [{ url: makeShareImageURL(notice?.title, true) }],
        title: notice?.title,
      }}
    />

    <HeroTitle prose title={notice?.title} transparent>
      <div className="h-2" />
      <Label>Members’ Notices</Label>{" "}
      <Link href="/members" arrow className="text-sm font-medium">
        View all
      </Link>
    </HeroTitle>
    <Container className="my-12 max-w-prose space-y-6">
      <div className="divide-y overflow-hidden rounded border">
        <NoticeBody notice={notice} />
      </div>
    </Container>
  </Layout>
);

export default Notice;
