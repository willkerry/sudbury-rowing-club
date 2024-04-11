import { InferGetStaticPropsType, NextPage } from "next";
import { NextSeo } from "next-seo";
import { dash, group } from "radash";
import { fetchArchives } from "@sudburyrc/api";
import { makeShareImageURL } from "@/lib/og-image";
import { ArchiveItem } from "@/components/anniversary/150-archive-item";
import { HundredAndFiftyBanner } from "@/components/anniversary/150-banner";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Link from "@/components/stour/link";

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
  const archivesGroupedByHalfCentury = group(
    await fetchArchives(),
    (archive) => {
      if (!archive.year) return "Unknown";

      const year = new Date(archive.year)?.getFullYear();
      return Math.floor(year / 50) * 50;
    },
  );

  return {
    props: {
      archives: Object.entries(archivesGroupedByHalfCentury).map(
        ([halfCentury, archives]) => {
          const decade = formatNextHalfCentury(halfCentury);
          const slug = dash(decade).toLowerCase();

          return { decade, slug, archives };
        },
      ),
    },
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Join: NextPage<Props> = ({ archives }) => (
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

    <Container>
      <ul className="mb-8 flex flex-wrap gap-x-4">
        {archives.map(({ decade, slug }) => (
          <li key={slug}>
            <Link href={`#${slug}`}>{decade}</Link>
          </li>
        ))}
      </ul>

      {archives.map(({ decade, slug, archives }) => (
        <div key={slug} className="mb-8">
          <h2 id={slug} className="mb-2 text-xl font-medium text-gray-900">
            {decade}
          </h2>
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
