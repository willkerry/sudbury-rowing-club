import { IconNavItemType, NavItemType } from "@/types/nav-item";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import cn from "classnames";

import { CompactMobileMenuItem, MobileMenuItem } from "./mobile-menu-item";

type CompactSectionProps = {
  title: string;
  data: NavItemType[];
};
type SectionProps = {
  title: string;
  data: IconNavItemType[];
  collapse?: boolean;
};
type SectionWrapperProps = {
  title: string;
  compact?: boolean;
  children: React.ReactNode;
  collapse?: boolean;
};

const SectionWrapper: React.FC<SectionWrapperProps> = ({
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
        "grid grid-cols-2 sm:grid-cols-3 gap-x-6",
        compact ? "gap-y-1" : "gap-y-4"
      )}
    >
      {children}
    </nav>
  );
  if (collapse)
    return (
      <Disclosure>
        {({ open }) => (
          <div className={outer}>
            <Disclosure.Button
              className={cn(
                titleClasses,
                "flex justify-between w-full py-4 -my-4"
              )}
            >
              {title}
              <ChevronDownIcon
                className={cn("w-4 h-4", open && "rotate-180")}
              />
            </Disclosure.Button>
            <Disclosure.Panel className={panel}>{inner}</Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    );
  return (
    <div className={outer}>
      <div className={titleClasses}>{title}</div>
      <div className={panel}>{inner}</div>
    </div>
  );
};

export const MobileMenuSection: React.FC<SectionProps> = ({
  title,
  data,
  collapse = false,
}: SectionProps) => (
  <SectionWrapper title={title} compact={false} collapse={collapse}>
    {data.map((item) => (
      <MobileMenuItem data={item} key={item.href} />
    ))}
  </SectionWrapper>
);

export const CompactMobileMenuSection: React.FC<CompactSectionProps> = ({
  title,
  data,
}: CompactSectionProps) => (
  <SectionWrapper title={title} compact>
    {data.map((item) => (
      <CompactMobileMenuItem data={item} key={item.href} />
    ))}
  </SectionWrapper>
);
