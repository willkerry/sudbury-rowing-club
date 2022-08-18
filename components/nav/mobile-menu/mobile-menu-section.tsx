import { IconNavItemType, NavItemType } from "@/types/nav-item";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
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

const SectionWrapper: React.FC<SectionWrapperProps> = (
  props: SectionWrapperProps
) => {
  const outer: string = "px-5 py-4";
  const title = "text-xs font-semibold tracking-wider text-gray-500 uppercase";
  const panel = "mt-3";
  const inner = (
    <nav
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 gap-x-6",
        props.compact ? "gap-y-1" : "gap-y-4"
      )}
    >
      {props.children}
    </nav>
  );
  if (props.collapse)
    return (
      <Disclosure>
        {({ open }) => (
          <div className={outer}>
            <Disclosure.Button
              className={cn(title, "flex justify-between w-full py-4 -my-4")}
            >
              {props.title}
              <ChevronDownIcon className={cn("w-4 h-4", open && "rotate-180")} />
            </Disclosure.Button>
            <Disclosure.Panel className={panel}>{inner}</Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    );
  return (
    <div className={outer}>
      <div className={title}>{props.title}</div>
      <div className={panel}>{inner}</div>
    </div>
  );
};

export const MobileMenuSection: React.FC<SectionProps> = (
  props: SectionProps
) => (
  <SectionWrapper title={props.title} compact={false} collapse={props.collapse}>
    {props.data.map((item, i) => (
      <MobileMenuItem data={item} key={i} />
    ))}
  </SectionWrapper>
);

export const CompactMobileMenuSection: React.FC<CompactSectionProps> = (
  props: CompactSectionProps
) => (
  <SectionWrapper title={props.title} compact={true}>
    {props.data.map((item, i) => (
      <CompactMobileMenuItem data={item} key={i} />
    ))}
  </SectionWrapper>
);
