import { Slot } from "@radix-ui/react-slot";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type DetailProps = {
  summary: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const Details = ({ items }: { items: DetailProps[] }) => (
  <Accordion type="single" collapsible>
    {items.map(({ summary, icon, children }) => (
      <AccordionItem key={summary} value={summary}>
        <AccordionTrigger>
          <div className="flex items-center justify-between gap-x-2">
            <Slot aria-hidden className="h-6 w-6 stroke-[1.5px] text-gray-400">
              {icon}
            </Slot>
            {summary}
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default Details;
