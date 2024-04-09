import { InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import { fetchArchiveById, fetchArchives } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import { ArchiveImage } from "@/components/anniversary/150-archive-image-lightbox";
import { HundredAndFiftyBanner } from "@/components/anniversary/150-banner";
import { HundredAndFiftyContactButton } from "@/components/anniversary/150-contact-button";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { Button } from "@/components/ui/button";
import { formatYear } from ".";

const getGeohackURL = (lat: number, lng: number, title: string) =>
  `https://geohack.toolforge.org/geohack.php?params=${lat};${lng}_globe:earth_type:camera&title=${title}`;

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

      <div className="max-w-prose pb-8 text-sm text-gray-800">
        <p>{archive.description}</p>

        <p className="mb-6 mt-4 text-xs font-medium text-gray-600">
          {archive.year ? (
            <ArchiveDate date={archive.year} range={archive.range}>
              {formatYear(archive.year, archive.range)}
            </ArchiveDate>
          ) : (
            <span className="tracking-normal">Date unknown</span>
          )}
        </p>

        <div className="flex gap-2">
          {archive.location && (
            <Button asChild size="xs">
              <a
                href={getGeohackURL(
                  archive.location?.lat || 0,
                  archive.location?.lng || 0,
                  archive.title,
                )}
                rel="noreferrer"
                target="_blank"
              >
                View location
              </a>
            </Button>
          )}

          <Button asChild size="xs" variant="secondary">
            <a
              href={archive.image.url}
              rel="noreferrer"
              target="_blank"
              download
            >
              Download full size image
            </a>
          </Button>

          <HundredAndFiftyContactButton
            size="xs"
            variant="link"
            message={`I would like to help identify or date the photo '${archive.title}', (ID ${archive._id}).\n\nMy message: `}
          >
            Help identify this photo
          </HundredAndFiftyContactButton>
        </div>
      </div>
    </Container>
  </Layout>
);

export default Archive;
