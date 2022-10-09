import Label from "@/components/stour/label";
import Text from "@/components/stour/text";
import DateFormatter from "@/components/utils/date-formatter";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon, LinkIcon } from "@heroicons/react/20/solid";
import { PortableTextProps } from "@portabletext/react";
import cn from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import FileGroup from "./file-group";

export type FileGroupProps = {
  fileItems: {
    title: string;
    documents: {
      _key: string;
      title: string;
      url: string;
    }[];
  }[];
};

export type CollapsibleCardProps = {
  title: string;
  body: PortableTextProps["value"];
  updated: string;
  created: string;
  items: FileGroupProps["fileItems"];
  meta: {
    _key: string;
    label: string;
    value: string;
  }[];
  slug?: string;
};

export const NoticeBody = ({
  body,
  items,
  meta,
  updated,
  created,
  link,
}: Omit<CollapsibleCardProps, "title"> & { link?: string }) => {
  const [splitItemCount, setSplitItemCount] = useState(0);
  useEffect(() => {
    if (items) {
      setSplitItemCount(Math.ceil(items.length / 2));
    }
  }, [items]);
  return (
    <>
      {body && <Text portableText={body} className="p-4" />}
      {meta && (
        <div className="flex py-2.5 text-sm bg-gray-50">
          {meta.map((item) => (
            <div className="px-4" key={item._key}>
              <Label className="text-xs select-none">{`${item.label}: `}</Label>
              <span className="text-xs font-medium disambiguate !text-gray-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
      {items && (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <FileGroup fileItems={items.slice(0, splitItemCount)} />
          <FileGroup fileItems={items.slice(splitItemCount)} />
        </div>
      )}
      <div className="flex justify-between gap-4 px-4 py-3 text-xs font-medium text-gray-500 bg-gray-100">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Created:{" "}
            <DateFormatter
              dateString={created}
              format="short"
              className="text-gray-700 disambiguate"
            />
          </span>
          <span>
            Updated:{" "}
            <DateFormatter
              dateString={updated}
              format="time"
              className="text-gray-700 disambiguate"
            />
          </span>
        </div>
        {link && (
          <Link href={link} passHref>
            <a
              className="transition-colors hover:text-black"
              title="Open permalink"
            >
              <LinkIcon className="w-4 h-4" />
            </a>
          </Link>
        )}
      </div>
    </>
  );
};

const CollapsibleCard = ({
  title,
  body,
  items,
  meta,
  updated,
  created,
  slug,
}: CollapsibleCardProps) => (
  <Disclosure
    as="div"
    className="overflow-hidden border divide-y rounded"
    id={slug}
  >
    {({ open }) => (
      <>
        <Disclosure.Button
          className={`flex items-center justify-between w-full px-4 text-left h-14 group hover:bg-gray-50 transition ${
            open && "bg-gray-50"
          }`}
        >
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
            <NoticeBody
              body={body}
              items={items}
              meta={meta}
              created={created}
              updated={updated}
              link={`../members/${slug}`}
            />
          </Disclosure.Panel>
        </Transition>
      </>
    )}
  </Disclosure>
);

export default CollapsibleCard;
