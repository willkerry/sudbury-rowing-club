import { NavLogo, NavSection } from "@/components/nav";
import {
  MobileMenuButton,
  MobileMenuSection,
} from "@/components/nav/mobile-menu";
import { Popover, Transition } from "@headlessui/react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { fork } from "radash";
import { Fragment } from "react";
import { navigationGroups, secondaryNavigationGroups } from "./nav-data";

const extractSingletonGroups = (
  primary: typeof navigationGroups,
  secondary: typeof secondaryNavigationGroups,
) => {
  const [primarySingletons, primaryGroups] = fork(
    primary,
    ({ items }) => items.length === 1,
  );
  const [secondarySingletons, secondaryGroups] = fork(
    secondary,
    ({ items }) => items.length === 1,
  );

  return {
    primaryGroups: [
      ...primaryGroups,
      {
        title: "More",
        items: [
          ...primarySingletons.map(({ items }) => items[0]),
          ...secondarySingletons.map(({ items }) => items[0]),
        ],
      },
    ],
    secondaryGroups,
  };
};

const Nav = () => {
  const { primaryGroups, secondaryGroups } = extractSingletonGroups(
    navigationGroups,
    secondaryNavigationGroups,
  );

  return (
    <Popover className="bg-white text-gray-900" id="navbar">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-screen-lg px-4 sm:px-6">
            <div className="flex items-center justify-between py-3 md:py-6 xs:py-4">
              <NavLogo />
              <MobileMenuButton />

              <Popover.Group as="nav" className="mx-auto hidden sm:flex">
                {navigationGroups.map(({ title, items }) => (
                  <NavSection key={title} label={title} {...{ items }} />
                ))}
              </Popover.Group>

              <Popover.Group
                as="nav"
                className="hidden items-center justify-end sm:flex lg:w-0 lg:flex-1"
              >
                {secondaryNavigationGroups.map(({ title, items, icon }) => {
                  const Icon = icon || null;
                  return (
                    <NavSection
                      key={title}
                      label={title}
                      icon={
                        Icon ? (
                          <Icon aria-hidden className="flex h-4 w-4" />
                        ) : undefined
                      }
                      compact
                      {...{ items }}
                    />
                  );
                })}
              </Popover.Group>
            </div>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              static
              className="absolute inset-x-0 top-0 z-20 origin-top-right transform p-2 transition md:hidden"
            >
              <div className="relative divide-y rounded bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                {primaryGroups.map(({ title, items }) => (
                  <MobileMenuSection
                    collapse={title.toLowerCase() === "regatta"}
                    key={title}
                    title={title}
                    data={items}
                  />
                ))}

                {secondaryGroups.map(({ title, items }) => (
                  <MobileMenuSection
                    key={title}
                    title={title}
                    data={items}
                    compact
                  />
                ))}
              </div>
              <div className="absolute top-3 right-3">
                <Popover.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden />
                </Popover.Button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default Nav;
