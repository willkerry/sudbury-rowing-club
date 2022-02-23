import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import Image from "next/image";
import { Download } from "react-feather";
import groq from "groq";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Button from "@/components/stour/button";
import { BASE_URL } from "@/lib/constants";
import sanityClient from "@/lib/sanity.server";
import { urlFor } from "@/lib/sanity";

export default function Photography({ data }) {
  return (
    <Layout>
      <NextSeo
        title="Coursemap | Sudbury Regatta"
        description="Sudbury’s challenging regatta course."
        openGraph={{
          title: "Coursemap",
          description: "The Sudbury Regatta’s challenging regatta course.",
          images: [{ url: `${BASE_URL}/assets/og/course.png` }],
        }}
      />
      <HeroTitle title="Sudbury Regatta Course" breadcrumbs />
      <Container className="mb-16">
        <div className="my-16 prose">
          <p className="lead">{data.heading}</p>
          <p>{data.description}</p>
          <Button href={`${data.map}?dl=`} icon={<Download />} as="a">
            Download the PDF
          </Button>
        </div>
        <div className="flex overflow-hidden border rounded shadow-xl">
          <Image
            src={urlFor(data.mapImage.id)
              .width(982 * 2)
              .url()}
            width={982}
            height={982 / data.mapImage.aspectRatio}
            placeholder="blur"
            blurDataURL={data.mapImage.lqip}
            alt=""
          />
        </div>
      </Container>
    </Layout>
  );
}

Photography.propTypes = {
  data: PropTypes.shape({
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    map: PropTypes.string.isRequired,
    mapImage: PropTypes.shape({
      id: PropTypes.string.isRequired,
      aspectRatio: PropTypes.number.isRequired,
      lqip: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

Photography.defaultProps = {
  data: {},
};

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
    }`
  );
  return {
    props: { data },
  };
};
