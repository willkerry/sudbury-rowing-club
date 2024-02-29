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
            <div aria-hidden className="h-6 w-6 text-gray-400">
              {icon}
            </div>
            {summary}
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export default Details;
