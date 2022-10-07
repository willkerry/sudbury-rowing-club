import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import cn from "classnames";
import { Fragment } from "react";
import {
  CompactCTAList,
  CompactNavItemList,
  CTAList,
  NavItemList,
} from "./index";
import { type IconNavItemType } from "@/types/nav-item";

export const navLinkClasses =
  "group transition duration-200 inline-flex p-3 text-sm hover:text-black focus:outline-none hover:bg-gray-100 focus:bg- rounded-md";
export const navLinkColor = "text-gray-500";
export const navLinkActiveColor = "text-black";

type Props = {
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
  compact,
  navData,
  ctaData,
}: Props) => (
  <Popover className="relative">
    {({ open }) => (
      <>
        <Popover.Button
          className={cn(open && navLinkActiveColor, [
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
              className={cn(
                "w-3 h-3 ml-0.5 -mb-px transition group-hover:text-gray-800 text-gray-400"
              )}
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
              !compact
                ? "w-screen max-w-xs -translate-x-1/2 left-1/2"
                : " max-w-sm right-0"
            )}
          >
            <div className="overflow-hidden rounded shadow-lg ring-1 ring-black ring-opacity-5">
              {compact ? (
                <div className="relative grid gap-4 p-4 bg-white">
                  <CompactNavItemList items={navData} />
                </div>
              ) : (
                <div className="relative grid gap-5 px-5 py-6 bg-white sm:gap-7 sm:p-5">
                  <NavItemList items={navData} />
                </div>
              )}
              {compact ? (
                <div className="px-4 py-4 space-y-4 backdrop-blur rounded-b bg-opacity-75 bg-gray-200 backdrop-saturate-200 shadow-inner">
                  <CompactCTAList CTAs={ctaData} />
                </div>
              ) : (
                <div className="px-5 py-5 space-y-6 backdrop-blur rounded-b bg-opacity-75 bg-gray-200 backdrop-saturate-200 shadow-inner sm:flex sm:space-y-0 sm:space-x-6 sm:px-5">
                  <CTAList CTAs={ctaData} />
                </div>
              )}
            </div>
          </Popover.Panel>
        </Transition>
      </>
    )}
  </Popover>
);

export default NavSection;
