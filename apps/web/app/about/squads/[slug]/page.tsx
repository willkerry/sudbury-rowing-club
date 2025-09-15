import { allSquads } from "content-collections";
import { notFound } from "next/navigation";
import { OfficerContactCard } from "@/components/about/squads/officer-contact-card";
import { SquadLatestNews } from "@/components/about/squads/squad-latest-news";
import { Container } from "@/components/layouts/container";
import { MDXContent } from "@/components/mdx/mdx-content";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Text } from "@/components/stour/text";

type SquadPageParams = { slug: string };
type SquadPageParamObject = { params: Promise<SquadPageParams> };

export const generateStaticParams = () =>
  allSquads.map((squad) => ({
    slug: squad._meta.fileName.split(".")[0],
  }));

const SquadPage = async ({ params }: SquadPageParamObject) => {
  const { slug } = await params;
  const squad = allSquads.find(
    ({ _meta }) => _meta.fileName.split(".")[0] === slug,
  );

  if (!squad) return notFound();

  return (
    <>
      <PageHeader
        title={squad?.title}
        breadcrumbs
        description={squad?.description}
      />

      <Container className="mb-12">
        <OfficerContactCard query={squad.title} />

        <div className="h-12" />

        <MDXContent code={squad?.body} />
      </Container>

      {squad.keyword && (
        <Container className="mb-24">
          <Text>
            <h2 className="mb-4">Latest {squad.title.toLowerCase()} news</h2>
          </Text>

          <SquadLatestNews similarQuery={squad.keyword} />
        </Container>
      )}
    </>
  );
};

export default SquadPage;
