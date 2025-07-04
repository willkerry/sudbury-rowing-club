import Container from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import Link from "@/components/stour/link";
import { createMetadata } from "@/lib/create-metadata";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";

export const metadata = createMetadata({
  title: "Competitor Information | Sudbury Regatta",
  description: "Essential information for competitors at the Sudbury Regatta.",
  image: { title: "Competitor Information" },
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
    competitorInformation: { description, documents },
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
      <PageHeader title="Competitor information" breadcrumbs />
      <Container className="pb-16">
        <div className="prose">
          <p>{description}</p>

          {documents ? (
            <ul>
              {documents?.map((item) => (
                <li key={item._id}>
                  <Link
                    href={`${item.url}?dl=`}
                    download
                    aria-label={`Download ${item.title}`}
                    extension={item.extension}
                  >
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
