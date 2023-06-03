import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { type IconNavItemType } from "@/types/nav-item";
import { useRouter } from "next/router";
import Link from "next/link";
import { partition } from "lodash";

import cn from "@/lib/cn";

export const navLinkClasses = cn(
  "group transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 inline-flex px-2 md:px-3 py-2.5 text-sm hover:text-black rounded-md"
);
export const navLinkColor = "text-gray-500 font-medium";
export const navLinkActive = "text-black font-semibold";

const POPOVER_PANEL_CLASSES = new Map<boolean, string>([
  [true, "max-w-sm right-0"],
  [false, "w-screen max-w-xs -translate-x-1/2 left-1/2"],
]);

const ListItem = ({
  href,
  name,
  description,
  icon,
  mobileOnly,
  cta,
}: IconNavItemType) => {
  if (mobileOnly) return null;

  const Icon = icon || Fragment;

  return (
    <Link
      key={href}
      href={href}
      className={cn(
        "group flex rounded transition focus:bg-blue-50",
        description ? "items-start" : "items-center"
      )}
    >
      {icon && (
        <Icon
          className="mr-2.5 h-6 w-6 flex-shrink-0 text-blue-700 transition-colors group-hover:text-blue-500"
          aria-hidden
        />
      )}
      <div className="flex flex-col">
        <p
          className={cn(
            "py-0.5 text-sm font-semibold leading-none transition-colors group-hover:text-gray-900",
            cta
              ? "text-gray-900 group-hover:text-gray-500"
              : "text-gray-600 group-hover:text-gray-900"
          )}
        >
          {name}
        </p>
        {description && (
          <p className="text-xs font-medium text-gray-500 transition-colors group-hover:text-gray-700">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
};

type NavSectionProps = {
  icon?: React.ReactElement;
  label?: string;
  altLabel?: string;
  compact?: boolean;
  items: IconNavItemType[];
};

const NavSection = ({
  label,
  icon,
  altLabel,
  compact = false,
  items,
}: NavSectionProps) => {
  const { pathname } = useRouter();
  const isActive = items.some(({ href }) => pathname.includes(href));

  const [primaryItems, ctaItems] = partition(items, ({ cta }) => !cta);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={cn(
              isActive || open ? navLinkActive : navLinkColor,
              navLinkClasses,
              "items-center"
            )}
          >
            <>
              {label}
              {icon}
              {altLabel && <span className="sr-only">{altLabel}</span>}

              <ChevronDownIcon
                className={cn(
                  isActive ? "stroke-current text-gray-700" : "text-gray-400",
                  "-mb-px ml-0.5 h-3 w-3 transition group-hover:text-gray-800"
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
                "absolute z-20 mt-3 transform px-2 sm:px-0",
                POPOVER_PANEL_CLASSES.get(compact)
              )}
            >
              <div className="overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-4 bg-white p-4">
                  {primaryItems.map((item) => (
                    <ListItem key={item.href} {...item} />
                  ))}
                </div>
                <div
                  className={cn(
                    "rounded-b-md bg-gray-200 bg-opacity-75 shadow-inner backdrop-blur backdrop-saturate-200",
                    compact
                      ? "space-y-4 py-4 pl-3 pr-4"
                      : "flex space-x-6 space-y-0 px-4 py-3"
                  )}
                >
                  {ctaItems.map((item) => (
                    <ListItem key={item.href} {...item} />
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default NavSection;
