import {
  fetchArchiveById,
  fetchArchives,
  type Archive as TArchive,
} from "@sudburyrc/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { Photograph, WithContext } from "schema-dts";
import snarkdown from "snarkdown";
import { HundredAndFiftyArchiveButtons } from "@/components/anniversary/150-archive-buttons";
import { ArchiveImage } from "@/components/anniversary/150-archive-image-lightbox";
import { ClubJsonLd } from "@/lib/constants";
import { createMetadata } from "@/lib/create-metadata";
import { formatYear } from "../formatYear";

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

type ArchivePageParams = { slug: string };
type ArchivePageParamObject = { params: Promise<ArchivePageParams> };

export const generateStaticParams = async (): Promise<ArchivePageParams[]> => {
  const archives = await fetchArchives();

  return archives.map((archive) => ({
    slug: archive._id,
  }));
};

export const generateMetadata = async ({
  params,
}: ArchivePageParamObject): Promise<Metadata> => {
  const archive = await fetchArchiveById((await params).slug);

  if (!archive) return {};

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

const Archive = async ({ params }: ArchivePageParamObject) => {
  const archive = await fetchArchiveById((await params).slug);

  if (!archive) return notFound();

  return (
    <>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createArchiveJsonLd(archive)),
        }}
      />

      <ArchiveImage image={archive.image} alt={archive.alt || ""} />

      <div className="max-w-prose pb-8 text-gray-800 text-sm">
        <div
          dangerouslySetInnerHTML={{
            __html: snarkdown(
              archive.description?.replaceAll("\n", "<br />") || "",
            ),
          }}
        />
        <div className="mt-4 mb-6 font-medium text-gray-600 text-xs">
          {archive.year ? (
            <ArchiveDate date={archive.year} range={archive.range}>
              {formatYear(archive.year, archive.range)}
            </ArchiveDate>
          ) : (
            <span className="tracking-normal">Date unknown</span>
          )}
        </div>

        <HundredAndFiftyArchiveButtons archive={archive} />
      </div>
    </>
  );
};

export default Archive;
