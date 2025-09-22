import { type Archive, fetchArchives } from "@sudburyrc/api";
import type { Metadata } from "next";
import { dash, group } from "radashi";
import { ArchiveItem } from "@/components/anniversary/150-archive-item";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import { Container } from "@/components/layouts/container";
import { Link } from "@/components/stour/link";
import { createMetadata } from "@/lib/create-metadata";

const TITLE = "150th Anniversary Gallery" as const;
const DESCRIPTION =
  "Join us in celebrating 150 years of rowing in Sudbury" as const;
const UNKNOWN = "Unknown" as const;

const ERA = 25;

export const metadata: Metadata = {
  ...createMetadata({
    title: TITLE,
    description: DESCRIPTION,
    image: {
      subtitle: "1874–2024",
    },
  }),
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
        <div className="mb-4">
          <Link href="/150/gallery/map">View memory map</Link>
        </div>

        <ul className="mb-8 flex flex-wrap gap-x-4">
          {archives.map(({ era, slug }) => (
            <li key={slug}>
              <Link href={`#${slug}`}>{era}</Link>
            </li>
          ))}
        </ul>

        {archives.map(({ era, slug, archives }) => (
          <div key={slug} className="mb-8">
            <h2 className="mb-2 font-medium text-gray-900 text-xl">{era}</h2>
            <div className="sm:columns-2">
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
