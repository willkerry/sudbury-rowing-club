import Label from "@/components/stour/label";
import Text from "@/components/stour/text";
import DateFormatter from "@/components/utils/date-formatter";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon, LinkIcon } from "@heroicons/react/20/solid";
import cn from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import FileGroup from "./file-group";
import type { Notice } from "@/lib/queries/fetch-notices";

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
        <div className="flex py-2.5 text-sm bg-gray-50">
          {notice.meta.map((item) => (
            <div className="px-4" key={item._key}>
              <Label className="text-xs select-none">{`${item.label}: `}</Label>
              <span className="text-xs font-medium disambiguate !text-gray-800">
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
      <div className="flex justify-between gap-4 px-4 py-3 text-xs font-medium text-gray-500 bg-gray-100">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span>
            Created:{" "}
            <DateFormatter
              dateString={notice._createdAt}
              format="short"
              className="text-gray-700 disambiguate"
            />
          </span>
          <span>
            Updated:{" "}
            <DateFormatter
              dateString={notice._updatedAt}
              format="time"
              className="text-gray-700 disambiguate"
            />
          </span>
        </div>
        <Link
          href={`../members/${notice.slug}`}
          className="transition-colors hover:text-black"
          title="Open permalink"
        >
          <LinkIcon className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
};

const CollapsibleCard = ({ notice }: Props) => (
  <Disclosure
    as="div"
    className="overflow-hidden border divide-y rounded"
    id={notice.slug}
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
            {notice.title}
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
            <NoticeBody {...{ notice }} />
          </Disclosure.Panel>
        </Transition>
      </>
    )}
  </Disclosure>
);

export default CollapsibleCard;
