import { sanityClient } from "@sudburyrc/api";
import { IconDownload } from "@tabler/icons-react";
import groq from "groq";
import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/create-metadata";
import { CourseMap } from "./course-map";

export const metadata = createMetadata({
  description: "The Sudbury Regatta’s challenging regatta course.",
  image: { title: "Coursemap" },
  title: "Coursemap | Sudbury Regatta",
});

const Coursemap = async () => {
  const {
    heading,
    description,
    map,
    mapImage,
  }: {
    heading: string;
    description: string;
    map: string;
    mapImage: {
      id: string;
      lqip: string;
      aspectRatio: number;
    };
  } = await sanityClient.fetch(
    groq`*[_type == "regattaSettings"][0]
    {
      "heading": courseMap.heading,
      "description": courseMap.description,
      "map": courseMap.map.asset->url,
      "mapImage": 
      {
        'id': courseMap.mapImage.asset->_id,
        'aspectRatio': courseMap.mapImage.asset->metadata.dimensions.aspectRatio,
        'lqip': courseMap.mapImage.asset->metadata.lqip
      }
    }`,
  );

  return (
    <>
      <PageHeader breadcrumbs title="Regatta course" />
      <Container className="mb-16">
        <div className="prose auto-lead mb-16">
          <p>{heading}</p>
          <p>{description}</p>
          <Button asChild icon={<IconDownload />}>
            <a href={`${map}?dl=`}>Download the PDF</a>
          </Button>
        </div>
        <div className="flex overflow-hidden rounded-sm border shadow-xl">
          <CourseMap
            aspectRatio={mapImage.aspectRatio}
            id={mapImage.id}
            lqip={mapImage.lqip}
          />
        </div>
      </Container>
    </>
  );
};

export default Coursemap;
