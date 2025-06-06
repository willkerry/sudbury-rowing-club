import Container from "@/components/layouts/container";
import { NoticeBody } from "@/components/stour/collapsible-card/collapsible-card";
import HeroTitle from "@/components/stour/hero/hero-title";
import { createMetadata } from "@/lib/create-metadata";
import { fetchNoticeSlugs, fetchOneNotice } from "@sudburyrc/api";
import { notFound } from "next/navigation";

type MemberPageParams = { slug: string };
type MemberPageParamObject = { params: Promise<MemberPageParams> };

export const generateStaticParams = async (): Promise<MemberPageParams[]> => {
  const paths = await fetchNoticeSlugs();

  return paths.map(({ slug }) => ({ slug }));
};

export const generateMetadata = async ({ params }: MemberPageParamObject) => {
  const notice = await fetchOneNotice((await params).slug);

  if (!notice) return {};

  return createMetadata({
    title: notice?.title,
    description: "Members’ Notices",
  });
};

const Notice = async ({ params }: MemberPageParamObject) => {
  const notice = await fetchOneNotice((await params).slug);

  if (!notice) return notFound();

  return (
    <>
      <HeroTitle title={notice?.title} breadcrumbs />

      <Container className="px-0">
        <NoticeBody notice={notice} />
      </Container>
    </>
  );
};

export default Notice;
