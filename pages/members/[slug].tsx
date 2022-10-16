import groq from "groq";
import Head from "next/head";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import sanityClient from "@/lib/sanity.server";
import {
  FileGroupProps,
  NoticeBody,
} from "@/components/stour/collapsible-card/collapsible-card";
import { GetStaticPaths, GetStaticProps } from "next";

import { PortableTextProps } from "@portabletext/react";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import { FC } from "react";

export interface Meta {
  _key: string;
  label: string;
  value: string;
}

export interface NoticeProps {
  _createdAt: string;
  _id: string;
  _updatedAt: string;
  body: PortableTextProps["value"];
  documents: FileGroupProps["fileItems"];
  meta: Meta[];
  title: string;
  slug: { current: string };
}

const Notice: FC<{ notice: NoticeProps }> = ({ notice }) => (
  <Layout>
    <Head>
      <title>{notice?.title}</title>
    </Head>
    <HeroTitle prose title={notice?.title} transparent>
      <div className="h-2" />
      <Label>Members’ Notices</Label>{" "}
      <Link href="/members" arrow className="text-sm font-medium">
        View all
      </Link>
    </HeroTitle>
    <Container className="my-12 space-y-6 max-w-prose">
      <div className="overflow-hidden border divide-y rounded">
        <NoticeBody
          body={notice.body}
          items={notice.documents}
          meta={notice.meta}
          created={notice._createdAt}
          updated={notice._updatedAt}
        />
      </div>
    </Container>
  </Layout>
);

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await sanityClient.fetch(
    groq`*[_type == "members" && !(_id in path("drafts.**"))]{slug}`
  );
  const paths = data.map((item: { slug: { current: string } }) => ({
    params: { slug: item.slug.current },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<{
  notice: NoticeProps;
}> = async ({ params }) => {
  const notice = await sanityClient.fetch(
    groq`*[_type == "members" && !(_id in path("drafts.**")) && slug.current == $slug][0]{
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
        documents[] { _key, title, "url": asset->url }
      } 
    }`,
    { slug: params?.slug }
  );
  return { props: { notice }, revalidate: 60 };
};

export default Notice;
