import { getTranslations } from "next-intl/server";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/create-metadata";
import { sanityClient } from "@sudburyrc/api";
import groq from "groq";
import { Download } from "lucide-react";
import CourseMap from "./course-map";

export const metadata = createMetadata({
  title: "Coursemap | Sudbury Regatta",
  description: "The Sudbury Regatta’s challenging regatta course.",
  image: { title: "Coursemap" },
});

const Coursemap = async () => {
const t = await getTranslations("regatta/course");

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
      <HeroTitle
        title={t('sudbury-regatta-course')}
        breadcrumbs
        color="transparent"
      />
      <Container className="mb-16">
        <div className="prose my-16">
          <p className="lead">{heading}</p>
          <p>{description}</p>
          <Button icon={<Download />} asChild>
            <a href={`${map}?dl=`}>{t('download-pdf')}</a>
          </Button>
        </div>
        <div className="flex overflow-hidden rounded border shadow-xl">
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
