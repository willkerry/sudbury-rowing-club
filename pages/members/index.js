import { Disclosure, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import cn from "classnames";
import { ChevronDownIcon } from "@heroicons/react/solid";
import groq from "groq";
import Head from "next/head";
import Container from "@/components/layouts/container";
import HeroTitle from "@/components/stour/hero/hero-title";
import Layout from "@/components/layouts/layout";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import Text from "@/components/stour/text";
import sanityClient from "@/lib/sanity.server";

export default function Notices({ data }) {
  return (
    <Layout>
      <Head>
        <title>Members’ Notices</title>
      </Head>
      <HeroTitle prose title="Notices" transparent />
      <Container className="my-12 space-y-6 max-w-prose">
        {data.map((item) => (
          <Card
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

Notices.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      documents: PropTypes.arrayOf(PropTypes.object),
      meta: PropTypes.arrayOf(PropTypes.object),
      _createdAt: PropTypes.string.isRequired,
      _updatedAt: PropTypes.string.isRequired,
      body: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
};

function Card({ title, body, items, meta, updated, created }) {
  // Split the array of document groups into two arrays, one for the first half and one for the second half
  const splitItemCount = Math.ceil((items !== null && items.length) / 2);
  const firstColumnItems = items !== null && items.slice(0, splitItemCount);
  const secondColumnItems = items !== null && items.slice(splitItemCount);

  // Render a column of document groups
  const FileGroupList = ({ fileItems }) =>
    fileItems.map(
      (item) =>
        item.documents && (
          <div key={item} className="flex flex-col">
            {item.title && (
              <h3 className="font-medium text-gray-700">{item.title}</h3>
            )}
            {item.documents.map((doc) => (
              <Link key={doc._key} href={`${doc.url}?dl=`} download>
                {doc.title}
              </Link>
            ))}
          </div>
        )
    );
  const MetaSection = ({ metaItems }) =>
    metaItems.map((item) => (
      <div className="px-4" key={item._key}>
        <Label className="text-xs select-none">{`${item.label} : `}</Label>
        <Label className="text-xs !text-gray-800">{item.value}</Label>
      </div>
    ));
  const slug = title.toLowerCase().replace(/ /g, "-");

  return (
    <Disclosure
      as="div"
      className="overflow-hidden border divide-y rounded"
      id={slug}
    >
      {({ open }) => (
        <>
          <Disclosure.Button className="flex items-center justify-between w-full px-4 text-left h-14 group">
            <Label
              className="transition duration-300 group-hover:text-black"
              as="h2"
            >
              {title}
            </Label>
            <ChevronDownIcon
              className={cn(
                "w-6 h-6 text-gray-400 transition duration-300 opacity-0 group-hover:opacity-100",
                open ? "transform -rotate-180" : ""
              )}
            />
          </Disclosure.Button>
          <Transition
            enter="transition delay-50 duration-300 ease-in-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition duration-300 delay-50 ease-in-out"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Disclosure.Panel className="divide-y">
              {body && (
                <Text portableText className="p-4">
                  {body}
                </Text>
              )}

              {meta && (
                <div className="flex py-2.5 text-sm bg-gray-50">
                  <MetaSection metaItems={meta} />
                </div>
              )}
              {items !== null && (
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div className="space-y-4">
                    <FileGroupList fileItems={firstColumnItems} />
                  </div>
                  <div className="space-y-4">
                    <FileGroupList fileItems={secondColumnItems} />
                  </div>
                </div>
              )}
              <div className="flex gap-4 px-4 py-2 text-xs font-medium text-gray-500 bg-gray-100">
                <time dateTime={created}>
                  Created:{" "}
                  {new Date(created).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                {created !== updated && (
                  <time dateTime={updated}>
                    Updated:{" "}
                    {new Date(updated).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour12: true,
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </time>
                )}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.arrayOf(PropTypes.object),
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  meta: PropTypes.arrayOf(PropTypes.object),
  updated: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
};

Card.defaultProps = {
  body: null,
  meta: null,
};

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
