import { InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import { group } from "radash";
import { fetchArchives } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import { ArchiveItem } from "@/components/anniversary/150-archive-item";
import { HundredAndFiftyBanner } from "@/components/anniversary/150-banner";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";

const TITLE = "150th Anniversary Gallery";
const DESCRIPTION = "Join us in celebrating 150 years of rowing in Sudbury";

export const formatYear = (dateString: string | null, range: number | null) => {
  if (!dateString) return "";

  const year = new Date(dateString)?.getFullYear();

  if (range) return `c. ${year - range}–${year + range}`;
  return String(year);
};

const formatNextHalfCentury = (year: number | string) => {
  if (year === "Unknown") return year;

  const limit = Number(year) + 49;

  const limitLimitedToPresent =
    limit > new Date().getFullYear() ? "present" : limit;

  return `${year} to ${limitLimitedToPresent}`;
};

export const getStaticProps = async () => {
  const archives = await fetchArchives();

  const groupedByHalfCentury = group(archives, (archive) => {
    if (!archive.year) return "Unknown";

    const year = new Date(archive.year)?.getFullYear();
    return Math.floor(year / 50) * 50;
  });

  const archivedGroupedByHalfCentury = Object.entries(groupedByHalfCentury).map(
    ([halfCentury, archives]) => ({
      decade:
        halfCentury === "Unknown"
          ? halfCentury
          : formatNextHalfCentury(halfCentury),
      archives,
    }),
  );

  return { props: { archives: archivedGroupedByHalfCentury } };
};

const Join: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  archives,
}) => (
  <Layout>
    <NextSeo
      description={DESCRIPTION}
      openGraph={{
        description: DESCRIPTION,
        images: [
          {
            url: makeShareImageURL(TITLE, true, {
              subtitle: "1874–2024",
            }),
          },
        ],
        title: TITLE,
      }}
      title={TITLE}
    />

    <HundredAndFiftyBanner />
    <HundredAndFiftyHeader title="Anniversary gallery" href="/150" />

    <Container className="p-4">
      {archives.map(({ decade, archives }) => (
        <div key={decade} className="mb-8">
          <h2 className="mb-2 text-xl font-medium text-gray-900">{decade}</h2>
          <div className="sm:masonry-2-col gap-4">
            {archives?.map((archive) => (
              <ArchiveItem key={archive._id} {...archive} />
            ))}
          </div>
        </div>
      ))}
    </Container>
  </Layout>
);

export default Join;
