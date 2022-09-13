import groq from "groq";
import Head from "next/head";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import sanityClient from "@/lib/sanity.server";
import CollapsibleCard from "@/components/stour/collapsible-card";
import { FileGroupProps } from "@/components/stour/collapsible-card/collapsible-card";

type Props = {
  data: {
    _id: string;
    title: string;
    documents: FileGroupProps["fileItems"];
    meta: {
      _key: string;
      label: string;
      value: string;
    }[];
    _updatedAt: string;
    _createdAt: string;
    body: any[];
  }[];
};

export default function Notices({ data }: Props) {
  return (
    <Layout>
      <Head>
        <title>Members’ Notices</title>
      </Head>
      <HeroTitle prose title="Notices" transparent />
      <Container className="my-12 space-y-6 max-w-prose">
        {data.map((item) => (
          <CollapsibleCard
            key={item._id}
            title={item.title}
            items={item.documents}
            meta={item.meta}
            created={item._createdAt}
            updated={item._updatedAt}
            body={item.body}
          />
        ))}
      </Container>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const data = await sanityClient.fetch(
    groq`*[_type == "members" && !(_id in path("drafts.**"))]| order(_updatedAt desc){
      _id,
      _updatedAt,
      _createdAt,
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
      meta,
      documents[] {
        _key, 
        title, 
        documents[] {
          _key,
          title,
          "url": asset->url
        }
      } 
    }`
  );
  return {
    props: {
      data,
    },
  };
};
