"use client";

import {
  CloseButton,
  Popover,
  PopoverButton,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { fork } from "radashi";
import { Fragment } from "react";
import type { NavigationItem } from "@/components/nav/types";
import { cn } from "@/lib/utils";

export const navLinkClasses = cn(
  "group inline-flex rounded-md px-2 py-2.5 text-sm transition hover:text-black md:px-3",
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
  items,
}: NavigationItem) => {
  if (mobileOnly) return null;

  const Icon = icon || null;

  const isSubItem = !(icon || description);

  return (
    <>
      <CloseButton
        as={Link}
        key={href}
        href={href}
        className={cn(
          "group flex rounded-sm transition",
          description ? "items-start" : "items-center",
        )}
      >
        {Icon && (
          <Icon
            className="mr-2.5 h-6 w-6 shrink-0 text-blue-700 transition-colors group-hover:text-blue-500"
            aria-hidden
          />
        )}
        <div className="flex flex-col">
          <p
            className={cn(
              "flex py-0.5 text-sm leading-none transition-colors",
              {
                "text-gray-900 group-hover:text-gray-700": cta,
                "text-gray-600 group-hover:text-gray-900": !cta,
              },
              isSubItem ? "font-medium" : "font-semibold",
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
            <p className="font-medium text-gray-500 text-xs transition-colors group-hover:text-gray-900">
              {description}
            </p>
          )}
        </div>
      </CloseButton>

      {items && (
        <div className="-mt-2 ml-8.5 grid grid-cols-2 gap-2">
          {items.map((item) => (
            <ListItem key={item.href} {...item} />
          ))}
        </div>
      )}
    </>
  );
};

type NavSectionProps = {
  compact?: boolean;
  icon?: React.ReactElement;
  items: NavigationItem[];
  label?: string;
};

export const NavSection = ({
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
          <PopoverButton
            className={cn(
              isActive || open ? navLinkActive : navLinkColor,
              navLinkClasses,
              "items-center",
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span className={cn(icon && "sr-only")}>{label}</span>
            {icon}

            <ChevronDownIcon
              className={cn(
                isActive ? "stroke-current text-gray-700" : "text-gray-400",
                "-mb-px ml-0.5 h-3 w-3 transition group-hover:text-gray-800",
              )}
              aria-hidden
            />
          </PopoverButton>

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
              className="absolute top-12 right-1/2 h-6 w-6 rotate-45 rounded-xs bg-gray-200 bg-opacity-75 shadow-sm backdrop-blur-sm"
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
              <div className="overflow-hidden rounded-md bg-gray-200 bg-opacity-75 p-1 shadow-lg backdrop-blur-sm">
                <div className="relative grid gap-4 rounded-xs bg-white p-2 shadow-sm">
                  {primaryItems.map((item) => (
                    <ListItem key={item.href} {...item} />
                  ))}
                </div>

                <div
                  className={cn(
                    "pt-3 pb-2",
                    compact
                      ? "space-y-4 pr-4 pl-3"
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
