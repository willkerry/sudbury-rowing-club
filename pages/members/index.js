import Head from "next/head";
import Container from "@/components/container";
import HeroTitle from "@/components/hero-title";
import Layout from "@/components/layout";
import Link from "@/components/stour/link";
import Label from "@/components/stour/label";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import cn from "classnames";
import data from "@/data/notices.json";

export const getStaticProps = async () => {
  return {
    props: {
      notices: await data,
    },
  };
};

export default function Notices(props) {
  return (
    <Layout>
      <Head>
        <title>Notices</title>
      </Head>
      <HeroTitle prose title="Notices" transparent />
      <Container className="my-12 space-y-6 max-w-prose">
        {props.notices.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            items={item.items}
            meta={item.meta}
          >
            {item.content}
          </Card>
        ))}
      </Container>
    </Layout>
  );
}

function Card({ title, children, items, meta }) {
  // How many document groups do we have?
  const numberOfItems = items.length;

  // Sort those document groups by the number of documents in each group (just to help it look pretty)
  const sortedItems = items.sort((a, b) =>
    a.files.length < b.files.length
      ? 1
      : a.files.length > b.files.length
      ? -1
      : 0
  );

  // Split the array of document groups into two arrays, one for the first half and one for the second half
  const splitNumberOfItems = Math.ceil(numberOfItems / 2);
  const firstColumnItems = sortedItems.slice(0, splitNumberOfItems);
  const secondColumnItems = sortedItems.slice(splitNumberOfItems);

  // Render a column of document groups
  const FileGroupList = ({ items }) => {
    return items.map((item, index) => {
      return (
        <div key={index} className="flex flex-col">
          {item.group && (
            <h3 className="font-medium text-gray-700">{item.group}</h3>
          )}

          {item.files.map((file, index) => (
            <Link key={index} href={file.url} download>
              {file.name}
            </Link>
          ))}
        </div>
      );
    });
  };
  const MetaSection = ({ items }) => {
    return items.map((item, index) => {
      return (
        <div className="px-4" key={index}>
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
              <p className="p-4">{children}</p>
              {meta && meta.length > 0 && (
                <div className="flex py-2.5 text-sm bg-gray-50">
                  <MetaSection items={meta} />
                </div>
              )}
              {items && items.length > 0 && (
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div className="space-y-4">
                    <FileGroupList items={firstColumnItems} />
                  </div>
                  <div className="space-y-4">
                    <FileGroupList items={secondColumnItems} />
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
