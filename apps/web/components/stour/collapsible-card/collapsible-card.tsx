import Label from "@/components/stour/label";
import Text from "@/components/stour/text";
import DateFormatter from "@/components/utils/date-formatter";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon, LinkIcon } from "@heroicons/react/20/solid";
import cn from "@/lib/cn";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Notice } from "@/lib/queries/fetch-notices";
import FileGroup from "./file-group";

type Props = { notice: Notice };

export const NoticeBody = ({ notice }: Props) => {
  const [splitItemCount, setSplitItemCount] = useState(0);

  useEffect(() => {
    if (notice.documents) {
      setSplitItemCount(Math.ceil(notice.documents.length / 2));
    }
  }, [notice]);

  if (!notice) return null;

  return (
    <>
      {notice.body && <Text portableText={notice.body} className="p-4" />}
      {notice.meta && (
        <div className="flex bg-gray-50 py-2.5 text-sm">
          {notice.meta.map((item) => (
            <div className="px-4" key={item._key}>
              <Label className="select-none text-xs">{`${item.label}: `}</Label>
              <span className="disambiguate text-xs font-medium !text-gray-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
      {notice.documents && (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
          <FileGroup fileItems={notice.documents.slice(0, splitItemCount)} />
          <FileGroup fileItems={notice.documents.slice(splitItemCount)} />
        </div>
      )}
      <div className="flex justify-between gap-4 bg-gray-100 px-4 py-3 text-xs font-medium text-gray-500">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Created:{" "}
            <DateFormatter
              dateString={notice._createdAt}
              format="short"
              className="disambiguate text-gray-700"
            />
          </span>
          <span>
            Updated:{" "}
            <DateFormatter
              dateString={notice._updatedAt}
              format="time"
              className="disambiguate text-gray-700"
            />
          </span>
        </div>
        <Link
          href={`../members/${notice.slug}`}
          className="transition-colors hover:text-black"
          title="Open permalink"
        >
          <LinkIcon className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
};

const CollapsibleCard = ({ notice }: Props) => (
  <Disclosure
    as="div"
    className="divide-y overflow-hidden rounded border"
    id={notice.slug}
  >
    {({ open }) => (
      <>
        <Disclosure.Button
          className={`group flex h-14 w-full items-center justify-between px-4 text-left transition hover:bg-gray-50 ${
            open && "bg-gray-50"
          }`}
        >
          <Label
            className="transition duration-300 group-hover:text-black"
            as="h2"
          >
            {notice.title}
          </Label>
          <ChevronDownIcon
            className={cn(
              "h-6 w-6 text-gray-400 opacity-0 transition duration-300 group-hover:opacity-100",
              open ? "-rotate-180 transform" : ""
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
            <NoticeBody {...{ notice }} />
          </Disclosure.Panel>
        </Transition>
      </>
    )}
  </Disclosure>
);

export default CollapsibleCard;
