"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloseButton, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { fork } from "radash";
import { cn } from "@/lib/utils";
import { type IconNavItemType } from "@/types/nav-item";

export const navLinkClasses = cn(
  "group transition inline-flex px-2 md:px-3 py-2.5 text-sm hover:text-black rounded-md",
);
export const navLinkColor = "text-gray-500 font-medium";
export const navLinkActive = "text-black font-medium";

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

  const Icon = icon || null;

  return (
    <CloseButton
      as={Link}
      key={href}
      href={href}
      className={cn(
        "group flex rounded transition",
        description ? "items-start" : "items-center",
      )}
    >
      {Icon && (
        <Icon
          className="mr-2.5 h-6 w-6 flex-shrink-0 text-blue-700 transition-colors group-hover:text-blue-500"
          aria-hidden
        />
      )}
      <div className="flex flex-col">
        <p
          className={cn(
            "flex py-0.5 text-sm font-semibold leading-none transition-colors",
            cta
              ? "text-gray-900 group-hover:text-gray-700"
              : "text-gray-600 group-hover:text-gray-900",
          )}
        >
          {name}
          {!cta && (
            <span
              aria-hidden
              className="block scale-y-90 opacity-0 transition group-hover:translate-x-1 group-hover:scale-x-110 group-hover:opacity-100"
            >
              &rarr;
            </span>
          )}
        </p>
        {description && (
          <p className="text-xs font-medium text-gray-500 transition-colors group-hover:text-gray-900">
            {description}
          </p>
        )}
      </div>
    </CloseButton>
  );
};

type NavSectionProps = {
  compact?: boolean;
  icon?: React.ReactElement;
  items: IconNavItemType[];
  label?: string;
};

const NavSection = ({
  compact = false,
  icon,
  items,
  label,
}: NavSectionProps) => {
  const pathname = usePathname();
  const isActive = items.some(({ href }) => pathname === href);

  if (items.length === 1) {
    const { href, name } = items[0];
    return (
      <Link
        href={href}
        className={cn(isActive ? navLinkActive : navLinkColor, navLinkClasses)}
      >
        {name}
      </Link>
    );
  }

  const [primaryItems, ctaItems] = fork(items, ({ cta }) => !cta);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={cn(
              isActive || open ? navLinkActive : navLinkColor,
              navLinkClasses,
              "items-center",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <>
              <span className={cn(icon && "sr-only")}>{label}</span>
              {icon}

              <ChevronDownIcon
                className={cn(
                  isActive ? "stroke-current text-gray-700" : "text-gray-400",
                  "-mb-px ml-0.5 h-3 w-3 transition group-hover:text-gray-800",
                )}
                aria-hidden
              />
            </>
          </Popover.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-in-out delay-75 duration-100"
            enterFrom="translate-y-8 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition ease-in duration-75"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-8 opacity-0"
          >
            <div
              aria-hidden
              className="absolute right-1/2 top-12 h-6 w-6 rotate-45 rounded-sm bg-gray-200 bg-opacity-75 shadow backdrop-blur"
            />
          </Transition>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-in-out duration-75"
            enterFrom="opacity-0 -translate-y-10"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in-out duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <Popover.Panel
              static
              className={cn(
                "absolute z-20 mt-3 transform px-2 sm:px-0",
                POPOVER_PANEL_CLASSES.get(compact),
              )}
            >
              <div className="overflow-hidden rounded-md bg-gray-200 bg-opacity-75 p-1 shadow-lg backdrop-blur">
                <div className="relative grid gap-4 rounded-sm bg-white p-2 shadow">
                  {primaryItems.map((item) => (
                    <ListItem key={item.href} {...item} />
                  ))}
                </div>

                <div
                  className={cn(
                    "pb-2 pt-3",
                    compact
                      ? "space-y-4 pl-3 pr-4"
                      : "flex space-x-6 space-y-0 px-2",
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
