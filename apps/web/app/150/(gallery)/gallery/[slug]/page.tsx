import { HundredAndFiftyArchiveButtons } from "@/components/anniversary/150-archive-buttons";
import { ArchiveImage } from "@/components/anniversary/150-archive-image-lightbox";
import { createMetadata } from "@/lib/create-metadata";
import {
  type Archive as TArchive,
  fetchArchiveById,
  fetchArchives,
} from "@sudburyrc/api";
import type { Metadata } from "next";
import snarkdown from "snarkdown";
import { formatYear } from "../page";
import type { WithContext, Photograph } from "schema-dts";
import { ClubJsonLd } from "@/lib/constants";
import Script from "next/script";

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

export const generateStaticParams = async () => {
  const archives = await fetchArchives();

  return archives.map((archive) => ({
    slug: archive._id,
  }));
};

type ArchivePageParams = {
  params: Awaited<ReturnType<typeof generateStaticParams>>[number];
};

export const generateMetadata = async ({
  params,
}: ArchivePageParams): Promise<Metadata> => {
  const archive = await fetchArchiveById(params.slug);

  return createMetadata({
    title: `150th Anniversary Gallery: ${archive?.title || ""}`,
    description: archive?.description || "",
    image: {
      title: archive?.title || "",
      subtitle: archive?.year || "",
    },
  });
};

const createArchiveJsonLd = (archive: TArchive): WithContext<Photograph> => ({
  "@context": "https://schema.org",
  "@type": "Photograph",
  "@id": archive._id,
  dateCreated: archive.year || undefined,
  name: archive.title,
  contentLocation: {
    "@type": "Place",
    latitude: archive.location?.lat,
    longitude: archive.location?.lng,
  },
  image: archive.image.url,
  sourceOrganization: ClubJsonLd,
  description: archive.description || undefined,
});

const Archive = async ({ params }: ArchivePageParams) => {
  const archive = await fetchArchiveById(params.slug);

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createArchiveJsonLd(archive)),
        }}
      />

      <ArchiveImage image={archive.image} alt={archive.alt || ""} />

      <div className="max-w-prose pb-8 text-sm text-gray-800">
        <p
          dangerouslySetInnerHTML={{
            __html: snarkdown(
              archive.description?.replaceAll("\n", "<br />") || "",
            ),
          }}
        />
        <p className="mb-6 mt-4 text-xs font-medium text-gray-600">
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
    </>
  );
};

export default Archive;
