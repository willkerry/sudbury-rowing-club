import { HundredAndFiftyArchiveButtons } from "@/components/anniversary/150-archive-buttons";
import { ArchiveImage } from "@/components/anniversary/150-archive-image-lightbox";
import { HundredAndFiftyBanner } from "@/components/anniversary/150-banner";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { makeShareImageURL } from "@/lib/og-image";
import { fetchArchiveById, fetchArchives } from "@sudburyrc/api";
import type { InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import { formatYear } from ".";

const roundToNearestFive = (num: number) => Math.round(num / 5) * 5;

const formatYearsAgo = (date: string, hasRange: boolean) => {
  const ago = new Date().getFullYear() - new Date(date).getFullYear();

  if (hasRange) return `around ${roundToNearestFive(ago)} years ago`;

  return `${ago} years ago`;
};

const ArchiveDate = ({
  children,
  range,
  date,
}: {
  children: string;
  range: number | null;
  date: string;
}) => (
  <div>
    <span className="tracking-wider">{children}</span> (
    {formatYearsAgo(date, !!range)})
  </div>
);
export const getStaticPaths = async () => {
  const archives = await fetchArchives();

  const paths = archives.map((archive) => ({
    params: { id: archive._id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({
  params,
}: Awaited<ReturnType<typeof getStaticPaths>>["paths"][number]) => ({
  props: { archive: await fetchArchiveById(params.id as string) },
});

const Archive: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  archive,
}) => (
  <Layout>
    <HundredAndFiftyBanner />
    <HundredAndFiftyHeader title="Archive resource" href="/150/gallery" />

    <NextSeo
      title={`150th Anniversary Gallery: ${archive.title}`}
      description={archive.description || ""}
      openGraph={{
        images: [
          {
            url: makeShareImageURL(archive.image.url),
            alt: archive.alt || "",
          },
        ],
      }}
    />

    <Container>
      <ArchiveImage image={archive.image} alt={archive.alt || ""} />

      <div className="max-w-prose pb-8 text-gray-800 text-sm">
        <p>{archive.description}</p>

        <p className="mt-4 mb-6 font-medium text-gray-600 text-xs">
          {archive.year ? (
            <ArchiveDate date={archive.year} range={archive.range}>
              {formatYear(archive.year, archive.range)}
            </ArchiveDate>
          ) : (
            <span className="tracking-normal">Date unknown</span>
          )}
        </p>

        <HundredAndFiftyArchiveButtons archive={archive} />
      </div>
    </Container>
  </Layout>
);

export default Archive;
