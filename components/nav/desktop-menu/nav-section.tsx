import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import cn from "classnames";
import { Fragment } from "react";
import { type IconNavItemType } from "@/types/nav-item";
import { useRouter } from "next/router";
import {
  CompactCTAList,
  CompactNavItemList,
  CTAList,
  NavItemList,
} from "./index";

export const navLinkClasses =
  "group transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 inline-flex px-2 md:px-3 py-2.5 text-sm hover:text-black hover:bg-gray-50 hover:border-gray-100 border border-transparent rounded-md";
export const navLinkColor = "text-gray-500";
export const navLinkActive = "text-black font-medium";

const POPOVER_PANEL_CLASSES = new Map<boolean, string>([
  [true, "max-w-sm right-0"],
  [false, "w-screen max-w-xs -translate-x-1/2 left-1/2"],
]);

const PrimaryNavPanel = ({
  navData,
  compact,
}: {
  navData: IconNavItemType[];
  compact: boolean;
}) => {
  const className = cn(
    "relative grid p-4 bg-white",
    compact ? "gap-4" : "gap-5"
  );

  const Component = compact ? CompactNavItemList : NavItemList;

  return (
    <div {...{ className }}>
      <Component items={navData} />
    </div>
  );
};

const CTANavPanel = ({
  ctaData,
  compact,
}: {
  ctaData: IconNavItemType[];
  compact: boolean;
}) => {
  const className = cn(
    "bg-gray-200 bg-opacity-75 shadow-inner rounded-b-md backdrop-blur backdrop-saturate-200",
    compact ? "py-4 pl-3 pr-4 space-y-4" : "flex p-4 space-x-6 space-y-0"
  );

  const Component = compact ? CompactCTAList : CTAList;

  return (
    <div {...{ className }}>
      <Component CTAs={ctaData} />
    </div>
  );
};

type NavSectionProps = {
  icon?: React.ReactElement;
  label?: string;
  altLabel?: string;
  compact?: boolean;
  navData: IconNavItemType[];
  ctaData: IconNavItemType[];
};

const NavSection = ({
  label,
  icon,
  altLabel,
  compact = false,
  navData,
  ctaData,
}: NavSectionProps) => {
  const { pathname } = useRouter();

  let isActive = false;

  [...navData, ...ctaData]
    .filter(({ mobileOnly }) => !mobileOnly)
    .forEach(({ href }) => {
      if (pathname === href) {
        isActive = true;
      }
    });

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={cn(isActive && navLinkActive, open && "text-black", [
              navLinkColor,
              navLinkClasses,
              "items-center",
            ])}
          >
            <>
              {label}
              {icon}
              {altLabel && <span className="sr-only">{altLabel}</span>}
              <ChevronDownIcon
                className={`"w-3 h-3 ml-0.5 -mb-px transition group-hover:text-gray-800 text-gray-400",
                  ${isActive && "text-gray-700 stroke-current"}`}
                aria-hidden="true"
              />
            </>
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className={cn(
                "absolute z-20 px-2 mt-3 transform sm:px-0",
                POPOVER_PANEL_CLASSES.get(compact)
              )}
            >
              <div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <PrimaryNavPanel navData={navData} compact={compact} />
                <CTANavPanel ctaData={ctaData} compact={compact} />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default NavSection;
