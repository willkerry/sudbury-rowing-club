import { NextSeo } from "next-seo";
import Image from "next/image";
import { Download } from "react-feather";
import groq from "groq";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Button from "@/components/stour/button";
import { sanityClient } from "@sudburyrc/api";
import { NextPage } from "next";
import { makeShareImageURL } from "@/lib/og-image";
import { useSanityImageProps } from "@/hooks/useSanityImageProps";

type Props = {
  heading: string;
  description: string;
  map: string;
  mapImage: {
    id: string;
    aspectRatio: number;
    lqip: string;
  };
};

const Coursemap: NextPage<Props> = ({
  heading,
  description,
  map,
  mapImage,
}) => (
  <Layout>
    <NextSeo
      title="Coursemap | Sudbury Regatta"
      description="Sudbury’s challenging regatta course."
      openGraph={{
        title: "Coursemap",
        description: "The Sudbury Regatta’s challenging regatta course.",
        images: [{ url: makeShareImageURL("Coursemap", true) }],
      }}
    />
    <HeroTitle title="Sudbury Regatta Course" breadcrumbs />
    <Container className="mb-16">
      <div className="prose my-16">
        <p className="lead">{heading}</p>
        <p>{description}</p>
        <Button href={`${map}?dl=`} icon={<Download />} as="a">
          Download the PDF
        </Button>
      </div>
      <div className="flex overflow-hidden rounded border shadow-xl">
        <Image
          {...useSanityImageProps(mapImage.id)}
          width={982}
          height={982 / mapImage.aspectRatio}
          placeholder="blur"
          blurDataURL={mapImage.lqip}
          alt=""
        />
      </div>
    </Container>
  </Layout>
);

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
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
  return {
    props: data as Props,
  };
};

export default Coursemap;
