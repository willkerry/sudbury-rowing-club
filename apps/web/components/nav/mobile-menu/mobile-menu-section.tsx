import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import * as Accordion from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";
import { IconNavItemType } from "@/types/nav-item";

type SectionProps = {
  title: string;
  data: IconNavItemType[];
  collapse?: boolean;
  compact?: boolean;
};

type SectionWrapperProps = {
  title: string;
  compact?: boolean;
  children: React.ReactNode;
  collapse?: boolean;
};

const SectionWrapper = ({
  title,
  compact = false,
  children,
  collapse = false,
}: SectionWrapperProps) => {
  const outer: string = "px-5 py-4";
  const titleClasses =
    "text-xs font-semibold tracking-wider text-gray-500 uppercase";
  const panel = "mt-3";
  const inner = (
    <nav
      className={cn(
        "grid grid-cols-2 gap-x-6 sm:grid-cols-3",
        compact ? "gap-y-1" : "gap-y-4",
      )}
    >
      {children}
    </nav>
  );

  if (collapse)
    return (
      <Accordion.Root type="single" collapsible>
        <Accordion.Item className={outer} value={title}>
          <Accordion.Trigger
            className={cn(
              titleClasses,
              "-my-4 flex w-full justify-between py-4 [&[data-state=open]>svg]:-rotate-180",
            )}
          >
            {title}
            <ChevronDownIcon
              aria-hidden
              className="h-4 w-4 transition-transform duration-200"
            />
          </Accordion.Trigger>
          <Accordion.Content
            className={cn(
              panel,
              "transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down data-[state=closed]:opacity-0 data-[state=open]::opacity-100",
            )}
          >
            {inner}
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    );
  return (
    <div className={outer}>
      <div className={titleClasses}>{title}</div>
      <div className={panel}>{inner}</div>
    </div>
  );
};

export const MobileMenuSection = ({
  title,
  data,
  collapse = false,
  compact = false,
}: SectionProps) => (
  <SectionWrapper {...{ title, collapse, compact }}>
    {data.map((item) => {
      const Icon = item.icon || null;

      return (
        <Link
          key={item.name}
          href={item.href}
          className="-m-2 flex items-center rounded-md p-2 hover:bg-gray-100"
        >
          {!compact && Icon && (
            <Icon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-blue-700"
              aria-hidden
            />
          )}
          <span className="font-medium text-gray-900">
            {item.shortName ? item.shortName : item.name}
          </span>
        </Link>
      );
    })}
  </SectionWrapper>
);

export default MobileMenuSection;
