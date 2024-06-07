import { fetchNoticeSlugs, fetchOneNotice } from "@sudburyrc/api";
// import { makeShareImageURL } from "@/lib/og-image";
import Container from "@/components/layouts/container";
import { NoticeBody } from "@/components/stour/collapsible-card/collapsible-card";
import HeroTitle from "@/components/stour/hero/hero-title";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";

export const generateStaticParams = async () => {
  const paths = await fetchNoticeSlugs();

  return paths.map(({ slug }) => ({ slug }));
};

const Notice = async ({ params }: { params: { slug: string } }) => {
  const notice = await fetchOneNotice(params?.slug);
  return (
    <>
      {/* <NextSeo
        title={notice?.title}
        openGraph={{
          images: [{ url: makeShareImageURL(notice?.title, true) }],
          title: notice?.title,
        }}
      /> */}

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
    </>
  );
};

export default Notice;
