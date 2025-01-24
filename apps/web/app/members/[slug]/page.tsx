import { getTranslations } from "next-intl/server";
import Container from "@/components/layouts/container";
import { NoticeBody } from "@/components/stour/collapsible-card/collapsible-card";
import HeroTitle from "@/components/stour/hero/hero-title";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
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
const t = await getTranslations("members/[slug]");

  const notice = await fetchOneNotice((await params).slug);

  if (!notice) return notFound();

  return (
    <>
      <HeroTitle prose title={notice?.title} transparent>
        <div className="h-2" />
        <Label>{t('members-notices')}</Label>{" "}
        <Link href="/members" arrow className="font-medium text-sm">{t('view-all')}</Link>
      </HeroTitle>
      <Container className="mt-6 mb-12 max-w-prose space-y-6 sm:mt-12">
        <div className="divide-y overflow-hidden rounded border">
          <NoticeBody notice={notice} />
        </div>
      </Container>
    </>
  );
};

export default Notice;
