import { Metadata } from "next";
import { dash, group } from "radash";
import { Archive, fetchArchives } from "@sudburyrc/api";
import { createMetaData } from "@/lib/create-metadata";
import { ArchiveItem } from "@/components/anniversary/150-archive-item";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import Container from "@/components/layouts/container";
import Link from "@/components/stour/link";

const TITLE = "150th Anniversary Gallery" as const;
const DESCRIPTION =
  "Join us in celebrating 150 years of rowing in Sudbury" as const;
const UNKNOWN = "Unknown" as const;

const ERA = 25;

export const metadata: Metadata = {
  ...createMetaData({
    title: TITLE,
    description: DESCRIPTION,
    image: {
      subtitle: "1874–2024",
    },
  }),
};

export const formatYear = (dateString: string | null, range: number | null) => {
  if (!dateString) return "";

  const year = new Date(dateString)?.getFullYear();

  if (range) return `c. ${year - range}–${year + range}`;
  return String(year);
};

const formatEra = (year: number | string) => {
  if (year === UNKNOWN) return year;

  const limit = Number(year) + ERA - 1;

  const limitLimitedToPresent =
    limit > new Date().getFullYear() ? "present" : limit;

  return `${year} to ${limitLimitedToPresent}`;
};

const discriminateByEra = (archive: Archive) => {
  if (!archive.year) return UNKNOWN;

  const year = new Date(archive.year)?.getFullYear();
  return Math.floor(year / ERA) * ERA;
};

const transformArchives = (archives: Partial<Record<string, Archive[]>>) =>
  Object.entries(archives).map(([era, archives]) => {
    const formattedEra = formatEra(era);
    const slug = dash(formattedEra).toLowerCase();

    return { era: formattedEra, slug, archives };
  });

const Join = async () => {
  const archives = transformArchives(
    group(await fetchArchives(), discriminateByEra),
  );

  return (
    <>
      <HundredAndFiftyHeader title="Anniversary gallery" href="/150" />

      <Container>
        <ul className="mb-8 flex flex-wrap gap-x-4">
          {archives.map(({ era, slug }) => (
            <li key={slug}>
              <Link href={`#${slug}`}>{era}</Link>
            </li>
          ))}
        </ul>

        {archives.map(({ era, slug, archives }) => (
          <div key={slug} className="mb-8">
            <h2 id={slug} className="mb-2 text-xl font-medium text-gray-900">
              {era}
            </h2>
            <div className="sm:masonry-2-col gap-4">
              {archives?.map((archive) => (
                <ArchiveItem key={archive._id} {...archive} />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </>
  );
};

export default Join;
