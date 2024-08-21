"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Mouse } from "lucide-react";
import { useState } from "react";

export type DetailProps = {
  summary: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const Details = ({ items }: { items: DetailProps[] }) => {
  const [scrolled, setScrolled] = useState(false);

  return (
    <Accordion type="single" collapsible>
      {items.map(({ summary, icon, children }) => (
        <AccordionItem key={summary} value={summary}>
          <AccordionTrigger>
            <div className="flex items-center justify-between gap-x-2">
              <Slot
                aria-hidden
                className="h-6 w-6 stroke-[1.5px] text-gray-400"
              >
                {icon}
              </Slot>
              {summary}
            </div>
          </AccordionTrigger>
          <AccordionContent
            className="relative h-96 resize-y overflow-y-auto border-t pt-2"
            onScrollCapture={() => {
              if (scrolled) return;

              setScrolled(true);
            }}
          >
            {children}

            <div
              aria-hidden
              className="pointer-events-none absolute bottom-1 left-0 right-0"
            >
              <Mouse
                className={cn(
                  "mx-auto h-6 w-6 animate-bounce fill-white stroke-[1.5px] text-gray-400 opacity-100 transition-opacity",
                  scrolled && "opacity-0",
                )}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default Details;
