import Container from "@/components/layouts/container";
import { NoticeBody } from "@/components/stour/collapsible-card/collapsible-card";
import HeroTitle from "@/components/stour/hero/hero-title";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import { createMetadata } from "@/lib/create-metadata";
import { fetchNoticeSlugs, fetchOneNotice } from "@sudburyrc/api";

export const generateStaticParams = async () => {
  const paths = await fetchNoticeSlugs();

  return paths.map(({ slug }) => ({ slug }));
};

type Params = {
  params: Awaited<ReturnType<typeof generateStaticParams>>[number];
};

export const generateMetadata = async ({ params }: Params) => {
  const notice = await fetchOneNotice(params?.slug);

  return createMetadata({
    title: notice?.title,
    description: "Members’ Notices",
  });
};

const Notice = async ({ params }: Params) => {
  const notice = await fetchOneNotice(params?.slug);

  return (
    <>
      <HeroTitle prose title={notice?.title} transparent>
        <div className="h-2" />
        <Label>Members’ Notices</Label>{" "}
        <Link href="/members" arrow className="text-sm font-medium">
          View all
        </Link>
      </HeroTitle>
      <Container className="mb-12 mt-6 max-w-prose  space-y-6 sm:mt-12">
        <div className="divide-y overflow-hidden rounded border">
          <NoticeBody notice={notice} />
        </div>
      </Container>
    </>
  );
};

export default Notice;
