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
import { useRouter } from "next/router";

export const navLinkClasses =
  "group transition duration-200 inline-flex px-3 py-2.5 text-sm hover:text-black focus:outline-none hover:bg-gray-50 hover:border-gray-100 border border-transparent rounded-md";
export const navLinkColor = "text-gray-500";
export const navLinkActive = "text-black font-medium";

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
}: Props) => {
  const router = useRouter();

  let isActive = false;

  [...navData, ...ctaData]
    .filter((item) => !item.mobileOnly)
    .forEach((item) => {
      if (router.pathname === item.href) isActive = true;
      return;
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
                  <div className="py-4 pl-3 pr-4 space-y-4 bg-gray-200 bg-opacity-75 rounded-b shadow-inner backdrop-blur backdrop-saturate-200">
                    <CompactCTAList CTAs={ctaData} />
                  </div>
                ) : (
                  <div className="px-5 py-5 space-y-6 bg-gray-200 bg-opacity-75 rounded-b shadow-inner backdrop-blur backdrop-saturate-200 sm:flex sm:space-y-0 sm:space-x-6 sm:px-5">
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
};

export default NavSection;
