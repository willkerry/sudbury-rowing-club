import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Label from "@/components/stour/label";
import Link from "@/components/stour/link";
import Text from "@/components/stour/text";
import { sanityClient } from "@/lib/sanity.server";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import cn from "classnames";
import groq from "groq";
import Head from "next/head";

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

function Card({ title, body, items, meta, updated, created }) {
  // How many document groups do we have?

  const numberOfItems = items !== null ? items.length : 2;

  // Sort those document groups by the number of documents in each group (just to help it look pretty)
  const sortedItems =
    items !== null
      ? items.sort((a, b) =>
          a.files.length < b.files.length
            ? 1
            : a.files.length > b.files.length
            ? -1
            : 0
        )
      : [items];

  // Split the array of document groups into two arrays, one for the first half and one for the second half
  const splitNumberOfItems = Math.ceil(numberOfItems / 2);
  const firstColumnItems = sortedItems.slice(0, splitNumberOfItems);
  const secondColumnItems = sortedItems.slice(splitNumberOfItems);

  // Render a column of document groups
  const FileGroupList = ({ items }) => {
    return items.map((item, index) => {
      return (
        <div key={index} className="flex flex-col">
          {item.title && (
            <h3 className="font-medium text-gray-700">{item.title}</h3>
          )}

          {item.documents.map((doc) => (
            <Link key={doc._key} href={`${doc.url}?dl=`} download>
              {doc.title}
            </Link>
          ))}
        </div>
      );
    });
  };
  const MetaSection = ({ items }) => {
    return items.map((item) => {
      return (
        <div className="px-4" key={item._key}>
          <Label className="text-xs select-none">
            {item.label + ":" + " "}
          </Label>
          <Label className="text-xs !text-gray-800">{item.value}</Label>
        </div>
      );
    });
  };
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
                  <MetaSection items={meta} />
                </div>
              )}
              {items !== null && (
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div className="space-y-4">
                    <FileGroupList items={firstColumnItems} />
                  </div>
                  <div className="space-y-4">
                    <FileGroupList items={secondColumnItems} />
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
    revalidate: 3600,
  };
};
