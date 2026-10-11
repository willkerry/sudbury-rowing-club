import { Accordion } from "@base-ui/react/accordion";
import { Dialog } from "@base-ui/react/dialog";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { IconNavItemType } from "@/types/nav-item";

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
  const titleClasses = "text-xs font-semibold caps text-gray-500";
  const panel = "pt-3";
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
      <Accordion.Root>
        <Accordion.Item className={outer} value={title}>
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                titleClasses,
                "-my-4 flex w-full justify-between py-4 [&[data-panel-open]>svg]:-rotate-180",
              )}
            >
              {title}
              <IconChevronDown
                aria-hidden
                className="h-4 w-4 transition-transform duration-200 ease-out-strong motion-reduce:transition-none"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-out-strong data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
            <div className={panel}>{inner}</div>
          </Accordion.Panel>
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
        <Dialog.Close
          className="-m-2 flex items-center rounded-md p-2 hover:bg-gray-100"
          key={item.name}
          nativeButton={false}
          render={<Link href={item.href} />}
        >
          {!compact && Icon && (
            <Icon
              aria-hidden
              className="mr-1.5 h-5 w-5 shrink-0 text-blue-700"
              strokeWidth={1.5}
            />
          )}
          <span className="font-medium text-gray-900">
            {item.shortName ? item.shortName : item.name}
          </span>
        </Dialog.Close>
      );
    })}
  </SectionWrapper>
);
