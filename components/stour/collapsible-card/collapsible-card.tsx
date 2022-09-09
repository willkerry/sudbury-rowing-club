import Label from "@/components/stour/label";
import Text from "@/components/stour/text";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import cn from "classnames";
import FileGroup from "./file-group";
import DateTimeFormatter from "@/components/utils/datetime-formatter";
import DateFormatter from "@/components/utils/date-formatter";

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
  body: any[];
  updated: string;
  created: string;
  items: FileGroupProps["fileItems"];
  meta: {
    _key: string;
    label: string;
    value: string;
  }[];
};

const CollapsibleCard = ({
  title,
  body,
  items,
  meta,
  updated,
  created,
}: CollapsibleCardProps) => {
  const splitItemCount = Math.ceil(items?.length / 2);
  const firstColumnItems = items !== null ? items.slice(0, splitItemCount) : [];
  const secondColumnItems = items !== null ? items.slice(splitItemCount) : [];
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
              {body && <Text portableText={body} className="p-4" />}
              {meta && (
                <div className="flex py-2.5 text-sm bg-gray-50">
                  {meta.map((item) => (
                    <div className="px-4" key={item._key}>
                      <Label className="text-xs select-none">{`${item.label} : `}</Label>
                      <Label className="text-xs !text-gray-800">
                        {item.value}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {items && (
                <div className="grid grid-cols-2 gap-4 p-4">
                  <FileGroup fileItems={firstColumnItems} />
                  <FileGroup fileItems={secondColumnItems} />
                </div>
              )}
              <div className="flex gap-4 px-4 py-2 text-xs font-medium text-gray-500 bg-gray-100">
                <time dateTime={created}>
                  <>
                    Created: <DateFormatter dateString={created} />
                  </>
                </time>
                {created !== updated && (
                  <>
                    Updated: <DateTimeFormatter dateString={updated} />
                  </>
                )}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default CollapsibleCard;
