import { Download, ExternalLink } from "react-feather";
import PropTypes from "prop-types";
import { NextSeo } from "next-seo";
import { BASE_URL } from "lib/constants";
import groq from "groq";
import SafetyPopup from "@/components/safety";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import sanityClient from "@/lib/sanity.server";
import Text from "@/components/stour/text";
import Button from "@/components/stour/button";
import { GetStaticProps } from "next";
import { PortableTextProps } from "@portabletext/react";

type SafetyItem = {
  _id: string;
  _updatedAt: string;
  title: string;
  body: PortableTextProps["value"];
  document: {
    title: string;
    url: string;
  };
  link: {
    title: string;
    url: string;
  };
};
type SafetyStatus = {
  _updatedAt: string;
  description: string;
  display: boolean;
  status: string;
};

type Props = {
  safety: SafetyItem[];
  safetyStatus: SafetyStatus;
};

const Safety = ({ safety, safetyStatus }: Props) => (
  <Layout>
    <NextSeo
      title="Safety | Sudbury Rowing Club"
      description="Rowing safely at Sudbury Rowing Club."
      openGraph={{
        title: "Safety",
        description: "Rowing safely at Sudbury Rowing Club.",
        images: [{ url: `${BASE_URL}/assets/og/safety.png` }],
      }}
    />
    
    <HeroTitle prose title="Safety" />

    <Container className="mx-auto my-12 space-y-16 max-w-prose">
      {safetyStatus.display && (
        <div className="overflow-hidden border rounded">
          <SafetyPopup
            description={safetyStatus.description}
            date={safetyStatus._updatedAt}
            status={safetyStatus.status}
          />
        </div>
      )}
      {safety.map((item) => (
        <div
          key={item._id}
          id={item._id}
          className="space-y-6"
          data-updated-at={item._updatedAt}
        >
          <h2 className="mb-8 text-xl font-bold tracking-tight text-gray-800 md:pr-6">
            {item.title}
          </h2>
          {item.body && <Text portableText={item.body} />}
          {item.link && (
            <Button
              href={item.link.url}
              as="a"
              icon={
                item.link.url.includes(BASE_URL) ? (
                  <Download />
                ) : (
                  <ExternalLink />
                )
              }
            >
              {item.link.title}
            </Button>
          )}
          {item.document && (
            <Button
              as="a"
              href={`${item.document.url}?dl=`}
              icon={<Download />}
            >
              {item.document.title}
            </Button>
          )}
        </div>
      ))}
    </Container>
  </Layout>
);

export default Safety;

export const getStaticProps: GetStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`{
      "safety": *[_type == "safety" && !(_id in path("drafts.**"))] | order(_updatedAt asc){
        _updatedAt,
        _id,
        title,
        body[]{
          ...,
          _type == "figure" => {
            "_id": @.image.asset->_id,       
            "altText": @.image.asset->altText,
            "description": @.image.asset->description,   
            "lqip": @.image.asset->metadata.lqip,
            "aspectRatio": @.image.asset->metadata.dimensions.aspectRatio, 
          },
        },
        document != null => {
          document {
            title,
            "url": asset->url,
            "extension": asset->extension,
          },
        },
        link != null => { link },
      },
      "safetyStatus": *[_id == "safetyStatus" && !(_id in path("drafts.**"))][0]{
        _updatedAt,
        description,
        display,
        status
      } 
    }`
  );
  return {
    props: {
      safety: data.safety,
      safetyStatus: data.safetyStatus,
    },
  };
};
