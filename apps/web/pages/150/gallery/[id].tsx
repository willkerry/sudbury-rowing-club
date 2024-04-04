import { InferGetStaticPropsType, NextPage } from "next";
import { fetchArchiveById, fetchArchives } from "@sudburyrc/api";
import { ArchiveHeader } from "@/components/anniversary/archive-header";
import { ArchiveImage } from "@/components/anniversary/archive-image-lightbox";
import { Banner } from "@/components/anniversary/banner";
import Container from "@/components/layouts/container";
import Layout from "@/components/layouts/layout";
import Label from "@/components/stour/label";
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
    <Banner />
    <ArchiveHeader title="Archive resource" href="/150/gallery" />

    <Container>
      <ArchiveImage image={archive.image} alt={archive.alt || ""} />

      <div className="max-w-prose pb-8 text-sm text-gray-800">
        <p>{archive.description}</p>

        <p className="mt-4 text-xs font-medium tracking-wider text-gray-600">
          {archive.year
            ? formatYear(archive.year, archive.range)
            : "Date unknown"}
        </p>
      </div>
    </Container>
  </Layout>
);

export default Archive;
