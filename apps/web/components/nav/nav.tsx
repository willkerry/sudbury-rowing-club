"use client";

import { NavLogo, NavSection } from "@/components/nav";
import { MobileMenuSection } from "@/components/nav/mobile-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { Bars3Icon } from "lucide-react";
import { fork } from "radash";
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
    <div className="bg-white text-gray-900" id="navbar">
      <div className="container flex items-center justify-between px-4! py-3 xs:py-4 md:py-6">
        <NavLogo />
        {/* Mobile menu trigger */}
        <NavigationMenu className="sm:hidden">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="border-0 bg-transparent p-0 shadow-none">
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden />
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute inset-x-0 top-0 z-20 origin-top-right transform p-2 transition md:hidden">
                <div className="relative divide-y rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden />
                  </Button>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* Desktop nav */}
        <nav className="mx-auto hidden sm:flex">
          {navigationGroups.map(({ title, items }) => (
            <NavSection key={title} label={title} {...{ items }} />
          ))}
        </nav>
        <nav className="hidden items-center justify-end sm:flex lg:w-0 lg:flex-1 ">
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
        </nav>
      </div>
    </div>
  );
};

export default Nav;
