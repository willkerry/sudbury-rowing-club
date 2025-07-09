import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { Download } from "lucide-react";
import { Container } from "@/components/layouts/container";
import { PageHeader } from "@/components/stour/hero/page-header";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/create-metadata";
import CourseMap from "./course-map";

export const metadata = createMetadata({
  title: "Coursemap | Sudbury Regatta",
  description: "The Sudbury Regatta’s challenging regatta course.",
  image: { title: "Coursemap" },
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
      <PageHeader title="Regatta course" breadcrumbs />
      <Container className="mb-16">
        <div className="prose auto-lead mb-16">
          <p>{heading}</p>
          <p>{description}</p>
          <Button icon={<Download />} asChild>
            <a href={`${map}?dl=`}>Download the PDF</a>
          </Button>
        </div>
        <div className="flex overflow-hidden rounded-sm border shadow-xl">
          <CourseMap
            id={mapImage.id}
            aspectRatio={mapImage.aspectRatio}
            lqip={mapImage.lqip}
          />
        </div>
      </Container>
    </>
  );
};

export default Coursemap;
