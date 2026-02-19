import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Link } from "@/components/stour/link";
import { createMetadata } from "@/lib/create-metadata";

export const metadata = createMetadata({
  description: "Essential information for competitors at the Sudbury Regatta.",
  image: { title: "Competitor Information" },
  title: "Competitor Information | Sudbury Regatta",
});

export type CompetitorInformationType = {
  description: string;
  documents: {
    _id: string;
    title: string;
    extension: string;
    url: string;
  }[];
};

const CompetitorInformationPage = async () => {
  const {
    competitorInformation: { description, documents = [] },
  }: {
    competitorInformation: CompetitorInformationType;
  } = await sanityClient.fetch(groq`
  *[_type == "regattaSettings"][0]{
    competitorInformation {
      description,
      documents[] {
        title,
        "extension": asset->extension,
        "url": asset->url,
        "_id": asset->_id
      },
    },
  }`);

  return (
    <>
      <PageHeader breadcrumbs title="Competitor information" />
      <Container className="pb-16">
        <div className="prose">
          <p>{description}</p>

          {documents.length > 0 ? (
            <ul>
              {documents.map((item) => (
                <li key={item._id}>
                  <Link extension={item.extension} href={item.url}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No documents available</p>
          )}
        </div>
      </Container>
    </>
  );
};

export default CompetitorInformationPage;
