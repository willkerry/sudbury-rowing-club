import { InferGetStaticPropsType, NextPage } from "next";
import { fetchArchiveById, fetchArchives } from "@sudburyrc/api";
import { ArchiveImage } from "@/components/anniversary/150-archive-image-lightbox";
import { HundredAndFiftyBanner } from "@/components/anniversary/150-banner";
import { HundredAndFiftyContactButton } from "@/components/anniversary/150-contact-button";
import { HundredAndFiftyHeader } from "@/components/anniversary/150-header";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import { formatYear } from ".";

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

    <Container>
      <ArchiveImage image={archive.image} alt={archive.alt || ""} />

      <div className="max-w-prose pb-8 text-sm text-gray-800">
        <p>{archive.description}</p>

        <p className="mb-6 mt-4 text-xs font-medium tracking-wider text-gray-600">
          {archive.year ? (
            formatYear(archive.year, archive.range)
          ) : (
            <span className="tracking-normal">Date unknown</span>
          )}
        </p>

        <HundredAndFiftyContactButton
          size="xs"
          variant="secondary"
          message={`I would like to help identify or date the photo '${archive.title}', (ID ${archive._id}).\n\nMy message: `}
        >
          Help identify this photo
        </HundredAndFiftyContactButton>
      </div>
    </Container>
  </Layout>
);

export default Archive;
