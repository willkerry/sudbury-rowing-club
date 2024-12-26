"use client";

import Label from "@/components/stour/label";
import Text from "@/components/stour/text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import DateFormatter from "@/components/utils/date-formatter";
import { AccordionHeader } from "@radix-ui/react-accordion";
import type { Notice } from "@sudburyrc/api";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import FileGroup from "./file-group";

type Props = { notice: Notice };

export const NoticeBody = ({ notice }: Props) => {
  const splitItemCount = Math.ceil((notice.documents?.length ?? 2) / 2);

  if (!notice) return null;

  return (
    <>
      {notice.body && <Text portableText={notice.body} className="p-4" />}

      {notice.meta && (
        <div className="flex bg-gray-50 py-2.5 text-sm">
          {notice.meta.map((item) => (
            <div className="px-4" key={item._key}>
              <Label className="select-none text-xs">{`${item.label}: `}</Label>
              <span className="disambiguate !text-gray-800 font-medium text-xs">
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

      <div className="flex justify-between gap-4 bg-gray-100 px-4 py-3 font-medium text-gray-500 text-xs">
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
        >
          <span className="sr-only">Open permalink</span>
          <LinkIcon aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </>
  );
};

const CollapsibleCard = ({ notice }: Props) => (
  <Accordion
    type="single"
    className="divide-y overflow-hidden rounded border"
    id={notice.slug}
    collapsible
  >
    <AccordionItem value={notice.title}>
      <AccordionHeader>
        <AccordionTrigger className="group flex h-14 w-full items-center justify-between px-4 text-left transition hover:bg-gray-50 data-[state=open]:bg-gray-50">
          <Label
            className="transition duration-300 group-hover:text-black"
            as="h2"
          >
            {notice.title}
          </Label>
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent className="divide-y border-t p-0">
        <NoticeBody {...{ notice }} />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export default CollapsibleCard;
