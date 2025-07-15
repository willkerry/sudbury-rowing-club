"use client";

import type { Notice } from "@sudburyrc/api";
import { Label } from "@/components/stour/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const CollapsibleCard = ({
  notice,
  children,
}: {
  notice: Notice;
  children: React.ReactNode;
}) => (
  <Accordion
    type="single"
    className="divide-y overflow-hidden rounded-sm border"
    id={notice.slug}
    collapsible
  >
    <AccordionItem value={notice.title}>
      <AccordionTrigger className="group flex h-14 w-full items-center justify-between px-4 text-left transition hover:bg-gray-50 data-[state=open]:bg-gray-50">
        <Label
          className="transition duration-300 group-hover:text-black"
          as="p"
        >
          {notice.title}
        </Label>
      </AccordionTrigger>
      <AccordionContent className="divide-y border-t p-0">
        {children}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);
